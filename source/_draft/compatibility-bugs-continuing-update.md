## PopupWindow
### PopupWindow弹出后，设置WindowManager.LayoutParams.alpha,导致背景闪烁（华为手机）
解决方法：
```java
getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
```
设置窗口属性，让背景变暗

## Android support library 23.4.0: android.support.v7.widget.TintContextWrapper cannot be cast to Activity

1. both activity n TintContextWRapper comes from ContextWrapper. ContextWrapper have a method getBaseContext(). It should be easy to create a loop method that checks instanceof WrapContext, gets base context and then checks instanceof Activity. (If you have problems with this method comment here that I'll dig on some project of mine and paste here to u)
2. Because AppCompat wraps your context to be able to inject "compat" views and "compat" tinting and other "compat" stuff. That's normal.
Yes.
3. That's how AppCompat does its thing.
```java
Context context = req_view.getContext();
while (context instanceof ContextWrapper) {
    if (context instanceof Activity) {
        return (Activity)context;
    }
    context = ((ContextWrapper)context).getBaseContext();
}
```


 git push --set-upstream origin chengzg //创建远程分支chengzg并提交

docker run --detach -p 443:443 -p 80:80 -p 22:22 --name gitlab gitlab/gitlab-ce:latest

信大家都遇到过带虚拟按键的手机，然后通常都会有个需求，让你做一个从底部弹出的Popupwindow，这时，当虚拟按键消失的时候你的弹出窗口页面就乱掉了，如何解决呢？研究了一下有如下步骤：
1. 给popupwindow设置属性：
> popupWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
2. 注意popupwindow显示时的参数：
> mPopWindow.showAtLocation(getActivity().getWindow().getDecorView(), Gravity.BOTTOM, 0, 0);