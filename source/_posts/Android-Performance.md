---
title: Android Performance
date: 2017-03-26 23:29:04
tags:
 - Android
categories:
 - Android
---

Android性能优化

# Render
Android中的界面渲染采用VSYNC（垂直同步）机制。因为手机屏幕大都采用60hz的刷新率，所以大约每16ms刷新一次界面，如下图所示
![vsync](/images/android-performance/android-view-vsync.jpg)

## Rendering Pipeline
界面渲染流程是一个从CPU处理数据，然后传送到GPU栅格化显示的过程。
![Rendering Pipeline](/images/android-performance/android-render-pipeline.jpg)

 所以在渲染界面过程中，产生的性能问题主要分两种：
1. CPU处理阶段的Layouts问题
2. GPU处理阶段的Overdraw问题
针对以上两个问题，分别对应的优化方法如下：
1. 使用Hierarchy Viewer工具查看布局层级，减少多余层级，尽量扁平化布局结构。
2. 使用手机开发者选项中的`Show GPU Overdraw`，查看界面过度绘制情况，采用以下两种方式优化：
- 使用`Canvas.cliprect()`方法，指定裁剪区域，避免绘制不可见区域。
- 移除View的多余背景，设置透明背景，减少过度绘制。

![Rendering Pipeline Detail](/images/android-performance/android-render-pipeline-detail.jpg)

## Android UI and GPU
GPU处理UI就是栅格化的过程。通过CPU处理，几何图形和textures（纹理）被加载到GPU中，然后栅格化显示到屏幕上。主要的耗时操作发生在CPU处理View和把数据传输到GPU两个过程中。

![UI flow](/images/android-performance/android-ui-flow.jpg)



### GPU Overdraw
#### 清楚重复背景
1. 清除不必要的背景色，`getWindow().setBackgroundDrawable(null)`;
2. 头像背景的过度绘制优化
```java
if (chat.getAuthor().getAvatarId() == 0) {
     Picasso.with(getContext()).load(android.R.color.transparent).into(chat_author_avatar);
     chat_author_avatar.setBackgroundColor(chat.getAuthor().getColor());
} else {
     Picasso.with(getContext()).load(chat.getAuthor().getAvatarId()).into(
         chat_author_avatar);
     chat_author_avatar.setBackgroundColor(Color.TRANSPARENT);
}
```
#### clipRect and quickReject
不绘制不可见区域，裁剪绘制的区域
![canvas clipRect](/images/android-performance/canvas-cliprect.jpg)
- canvas.clipRect 设置裁剪区域
```java
canvas.save()
canvas.clipRect()
//draw code
canvas.restore()
```
- canvas.quickReject 判断是否在裁剪区域外

## Layous ,Invalidations and Perf
![Layous](/images/android-performance/android-display-flow.jpg)


### Hierarchy Viewer
使用此工具查看布局层级和measure、layout、draw性能分析。通过减少嵌套布局，尽量扁平化布局，来进行性能优化。

# Computer
程序执行会耗费cpu时间，一些方法执行时间很长，会带来性能问题，造成丢帧问题甚至ANR（5秒不响应），使用户感到卡顿。
![Computer](/images/android-performance/android-draw-wait.jpg)

## Traceview
Traceview记录了方法执行时间并显示执行数据,线程的时间和调用堆栈等信息，由此来跟踪代码中的性能问题。
[traceview](http://developer.android.com/tools/performance/traceview/index.html)
有两种方法生产trace文件：
1. 通过DDMS工具的Method Profiling(性能分析)。
2. 在代码中使用`Debug`类的方法：
```java
// start tracing to "/sdcard/calc.txt"
Debug.startMethodTracing('calc');
// code
Debug.stopMethodTracing();
```
参考资料
[debugging-tracing](http://developer.android.com/tools/debugging/debugging-tracing.html)
[debugging-tracing1](https://docs.google.com/a/knowlabs.com/document/d/1EKVq2FzcLVJFbwUtaC3QRddSwtzs0BSKZahkQyeGyHo/pub?embedded=true#h.xbsfzbxi5i1e)


## batching(批处理) and caching
通过批处理和缓存计算结果来达到优化计算性能的目的

## Container Performance(数据结构、容器类的性能)
通过使用合适的数据结构和容器类来提供程序执行效率
- 有序序列在大量数据时使用二分查找，快速排序等
- 无序序列使用hashtable

## SysTrace
Systrace工具帮助分析应用程序的性能通过捕获和显示应用程序的执行时间流程和其他Android系统过程。此工具从Android内核收集统计CPU调度、磁盘活动,和应用程序线程等信息生成一个HTML报告，显示Android系统一段时间内的整体状态。用于诊断应用程序速度慢的问题，卡顿，动画不流畅等问题。
有两种方式生成systrace信息：
1. 通过monitor中的ddms的systrace工具。
2. 代码中使用`Trace`类生产。

```java
Trace.beginSection();
//code
Trace.endSection();
```
参考
[systrace](https://developer.android.com/studio/profile/systrace.html)

# Memory
内存优化是最复杂，也是最重要的优化手段。通过Android提供的一系列工具，很方便的进行内存优化：
1. Memry Monitor : 实时查看内存状态
2. Heap Viewer : 查看内存堆中存放的对象信息
3. Allocation Tracker : 跟踪内存对象的分配信息，对象的创建
![Memory](/images/android-performance/android-code-executing.jpg)

## GC
GC即Garbage Collection。垃圾回收机制处理两个问题：
1. 找到没有被引用的对象
2. 回收那些对象占用的内存资源
![android jvm](/images/android-performance/android-jvm.jpg)


Android中分配的对象首先进入到`Young Generation`，如果其中的内存空间不够，就会触发GC操作，如下图：
![GC](/images/android-performance/android-gc.jpg)
而如果GC操作很耗时的话，就会导致下图所示情况，造成丢帧，给用户卡顿的感觉：
![GC block](/images/android-performance/android-gc-block.jpg)

## Memory Leaks
内存泄漏就是无用的对象还保持着对象的引用，导致GC机制无法回收，最终造成内存溢出等问题。减少内存泄漏是优化内存的主要方式。
![Memory Leaks](/images/android-performance/android-memory-leak.jpg)
## Heap Viewer
通过Heap Viewer工具可以查看应用程序对象分配,包括数量,在堆内存中的大小等信息。
[Heap Vierer](https://developer.android.com/studio/profile/heap-viewer-walkthru.html)
## Tracking Down the Leak in Code
下面一个例子，可以看到内存泄漏的情况：
```java
private void init() {
ListenerCollector collector = new ListenerCollector();
collector.setListener(this, mListener);
}
```
发生泄漏的语句是`collector.setListener(this, mListener); `

在这个例子中,当由于设备方向改变创建一个新的activity时，还会调用此方法，但是`onDestory`上一个activity时，listener保持着它的引用，导致无法销毁。所以应该在`onStop`方法中即时销毁无用的对象，释放activity的引用。

## Allocation Tracker
Allocation Tracker 工具记录应用程序的内存分配和所有分配对象的调用堆栈,大小和在代码中的位置。
使用此工具有两个重要作用：
1. 从调用堆栈中找到并且不断分配和回收的对象的位置。
2. 找到代码中可能导致内存使用效率低的地方。
[Allocation Tracker](https://developer.android.com/studio/profile/allocation-tracker-walkthru.html)
### reduce memory churn(降低内存占用)
比如：使用StringBuilder代替字符串累加

# Battery

电量主要消耗在以下一些地方：
- Application Processor
- Cellular Radio（移动网络）
- Screen

所以电量优化从以下几方面进行：
- lazy first
- Job Scheduler API
- Battery Historian

## Battery Historian
Battery Historian的使用方法如下：
```
 adb shell dumpsys batterystats --reset
 adb shell dumpsys batterystats > package name > historian.txt
python historian.py historian.txt > historian.html
```
[battery-historian](https://github.com/google/battery-historian)
[batterystats](http://developer.android.com/tools/performance/batterystats-battery-historian/index.html)
## Battery Manager
使用BatteryManager控制电池的使用逻辑
```java
// It is very easy to subscribe to changes to the battery state, but you can get the current
// state by simply passing null in as your receiver. Nifty, isn't that?
IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
Intent batteryStatus = this.registerReceiver(null, filter);
int chargePlug = batteryStatus.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
boolean acCharge = (chargePlug == BatteryManager.BATTERY_PLUGGED_AC);
if (acCharge) {
    Log.v(LOG_TAG,“The phone is charging!”);
}
```
在这个例子中,我们首先建立一个检测电池状态的意图过滤器。然后我们注册这个过滤器，获取当前电池状态。在这种情况下,我们检查是否处于充电状态，存储在一个布尔值中,然后我们可以使用它做程序逻辑。

## Wakelock and Battery Drain(流失)

频繁的Wakelock会导致电量流失，优化wakelock的使用。

## Network and Battery Drain
下图是发生移动网络请求时的电量使用信息，相比之下使用移动网络更加耗电。
![Battery Drain](/images/android-performance/android-battery-drain.jpg)

打包可以延迟的网络请求，有wifi时发送
## Job Scheduler
把不是即时的任务交给Job Scheduler执行

![Job Scheduler](/images/android-performance/android-job-scheduler.jpg)



