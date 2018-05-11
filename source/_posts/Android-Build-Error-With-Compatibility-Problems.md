---
title: Android依赖版本不兼容导致编译失败的总结
date: 2018-03-08 20:11:00
tags:
 - Android
categories:
 - Android
---

今天上班后，照常打开AndroidStudio，经过几分钟的编译，项目突然报错了，有点莫名其妙。
尝试了clean项目重新编译、升级各种依赖和工具版本、百度错误信息等等解决方案，依然无法正常编译项目。只能还原，冷静分析错误。

报错信息如下：

```
ERROR: In <declare-styleable> FontFamilyFont, unable to find attribute android:fontVariationSettings
ERROR: In <declare-styleable> FontFamilyFont, unable to find attribute android:ttcIndex
```

意思是说找不到定义的属性。

在Studio中全局搜索了一下**FontFamilyFont**、**fontVariationSettings**、**ttcIndex**，只定位到了**com.android.support:support-compat**包中，但还是没有头绪。

没办法，只能google了。google后在stackoverflow中找到一个有相似问题的[提问](https://stackoverflow.com/questions/49162538/running-cordova-build-android-unable-to-find-attribute-androidfontvariation)。从问题的答案中看到一种解决方法，把所有Android官方依赖包的版本都统一了，按照这个方式尝试了各种版本，还是不行。问题的回答中还有一句提示，可以用下面的命令分析项目中包的依赖关系。
```
gradlew -q dependencies app:dependencies --configuration debugAndroidTestCompileClasspath

```

去项目根目录执行后，显示了以下信息(省略部分无用信息)，可以看到每个包的依赖项都被递归分析并添加进来。

```
...
+--- com.gyf.barlibrary:barlibrary:2.2.9
|    \--- com.android.support:appcompat-v7:25.3.1 -> 27.1.0
|         +--- com.android.support:support-annotations:27.1.0 -> 28.0.0-alpha1
|         +--- com.android.support:support-core-utils:27.1.0 -> 28.0.0-alpha1
|         |    +--- com.android.support:support-annotations:28.0.0-alpha1
|         |    +--- com.android.support:support-compat:28.0.0-alpha1
|         |    |    +--- com.android.support:support-annotations:28.0.0-alpha1
|         |    |    +--- com.android.support:collections:28.0.0-alpha1
|         |    |    |    \--- com.android.support:support-annotations:28.0.0-alpha1
|         |    |    \--- android.arch.lifecycle:runtime:1.1.0
|         |    |         +--- android.arch.lifecycle:common:1.1.0
|         |    |         \--- android.arch.core:common:1.1.0
|         |    +--- com.android.support:documentfile:28.0.0-alpha1
|         |    |    \--- com.android.support:support-annotations:28.0.0-alpha1
|         |    +--- com.android.support:loader:28.0.0-alpha1
|         |    |    +--- com.android.support:support-annotations:28.0.0-alpha1
|         |    |    +--- com.android.support:support-compat:28.0.0-alpha1 (*)
|         |    |    +--- android.arch.lifecycle:livedata-core:1.1.0
|         |    |    |    +--- android.arch.lifecycle:common:1.1.0
|         |    |    |    +--- android.arch.core:common:1.1.0
|         |    |    |    \--- android.arch.core:runtime:1.1.0
|         |    |    |         \--- android.arch.core:common:1.1.0
|         |    |    \--- android.arch.lifecycle:viewmodel:1.1.0
|         |    +--- com.android.support:localbroadcastmanager:28.0.0-alpha1
|         |    |    \--- com.android.support:support-annotations:28.0.0-alpha1
|         |    \--- com.android.support:print:28.0.0-alpha1
|         |         \--- com.android.support:support-annotations:28.0.0-alpha1
|
+--- com.android.support:design:27.1.0
|    +--- com.android.support:support-v4:27.1.0 -> 28.0.0-alpha1 (*)
|    +--- com.android.support:appcompat-v7:27.1.0 (*)
|    +--- com.android.support:recyclerview-v7:27.1.0
|    |    +--- com.android.support:support-annotations:27.1.0 -> 28.0.0-alpha1
|    |    +--- com.android.support:support-compat:27.1.0 -> 28.0.0-alpha1 (*)
|    |    \--- com.android.support:support-core-ui:27.1.0 -> 28.0.0-alpha1 (*)
|    \--- com.android.support:transition:27.1.0
|         +--- com.android.support:support-annotations:27.1.0 -> 28.0.0-alpha1
|         \--- com.android.support:support-compat:27.1.0 -> 28.0.0-alpha1 (*)

...

```

**->** 符号代表这个依赖没有使用你指定的版本，而是使用了一个新的版本，带**(\*)**的行代表此依赖是引用依赖。gradle中处理依赖的规则是在同一个配置下（例如debugAndroidTestCompileClasspath），某个包的不同版本同时被依赖时，默认使用最新版，gradle同步时不会报错。

在仔细查看了依赖关系后，发现**com.android.support:design**包的依赖**com.android.support:support-compat**的版本是大于本身的版本，这可能是问题的根源，猜测低版本无法兼容高版本依赖。既然无法兼容低版本，那就用**com.android.support:design:28.0.0-alpha1**，继续编译。报错，错误如下：

```
Error:(5, 5) No resource found that matches the given name (at 'dialogCornerRadius' with value '?android:attr/dialogCornerRadius').
```
根据以往的经验，此类错误大多是由于使用低版本compileSdkVersion无法编译高版本依赖库引起，然后去检查compileSdkVersion版本，发现有更新，更新compileSdkVersion重新编译，问题解决。

在一上午的搜索中，还看到了一种强制设置引用依赖库版本的方法，如下：

```
configurations.all {
   resolutionStrategy {
       force 'com.android.support:support-compat:{version}'
   }
}
```

经过一番分析和尝试，把**com.android.support:design**包引用依赖的所有版本都设置成一样后，编译成功。
再查看依赖信息，显示如下，可以看到已经把不兼容的引用依赖换成了一样的版本。
```
+--- com.android.support:design:27.1.0
|    +--- com.android.support:support-v4:27.1.0 (*)
|    +--- com.android.support:appcompat-v7:27.1.0 (*)
|    +--- com.android.support:recyclerview-v7:27.1.0
|    |    +--- com.android.support:support-annotations:27.1.0
|    |    +--- com.android.support:support-compat:27.1.0 (*)
|    |    \--- com.android.support:support-core-ui:27.1.0 (*)
|    \--- com.android.support:transition:27.1.0
|         +--- com.android.support:support-annotations:27.1.0
|         \--- com.android.support:support-compat:27.1.0 (*)

```
因为新版本还处于alpha状态，所以使用的上一个稳定版*27.1.0*。最终的配置信息如下：
```
configurations.all {
    resolutionStrategy {
        force 'com.android.support:support-compat:27.1.0'
        force 'com.android.support:support-v4:27.1.0'
        force 'com.android.support:appcompat-v7:27.1.0'
        force 'com.android.support:support-core-utils:27.1.0'
        force 'com.android.support:support-core-ui:27.1.0'
        force 'com.android.support:support-fragment:27.1.0'
        force 'com.android.support:support-annotations:27.1.0'
    }
}
```
以上配置可以根据依赖情况自行加减。

## 总结

1. gradle中处理依赖的规则是某个包的不同版本同时被依赖时，默认使用远程仓库中的最新版，所以给包指定版本时也不一定会生效。
2. 低版本包依赖高版本时，可能会出兼容性问题，最好统一版本。用强制依赖配置或者升级到最新版两种方法解决。
3. 及时关注Android SDK升级，每次SDK升级都伴随着依赖库更新，及时查看更新内容，注意依赖库的改动。