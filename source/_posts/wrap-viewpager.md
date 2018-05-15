---
title: 自适应WebView内容高度的ViewPager
date: 2018-04-23 21:03:40
tag: Android
category: Android
---

# 打造自适应内容高度的ViewpPger
在我们的项目中，有一个ViewPager中的子元素是WebView，由于WebView的内容高度是不确定的，这样的话会导致ViewPager的其他子元素高度无法控制。所以就需要打造一个自适应子元素高度的ViewPager。

## 获取WebView内容高度

获取WebView的内容高度要通过WebView的`getContentHeight()`方法，但是由于WebView内容的加载不确定性，导致此方法不能及时获取到正确的高度。

所以我们要在`WebViewClint.onPageFinished(WebView view, String url)`方法中通过js代码获取到加载完成的内容高度。获取高度的代码如下：

```java
@Override
public void onPageFinished(WebView view, String url) {
    super.onPageFinished(view, url);
    view.postDelayed(new Runnable() {
        @Override
        public void run() {
            view.loadUrl("javascript:
            JavascriptInterface.getContentHeight(document.body.scrollHeight)");
        }
    },500);
}
```

`document.body.scrollHeight`这句js代码就能获取到web内容的正确高度，通过JavascriptInterface传到Java层，保存到本地。

>注意
这个`document.body.scrollHeight`是dp单位，需要转换px再保存到本地。


然后重写WebView的`getContentHeight()`方法：
```java{3}
@Override
public int getContentHeight() {
    if (mContentHeight>0)
        return mContentHeight;
    return super.getContentHeight();
}
```
`mContentHeight`就是JavascriptInterface传到java层的数据。


## 重写ViewPager

要使ViewPager高度自适应内容，就需要在ViewPager切换内容时，根据内容高度，动态调整ViewPager的高度。

首先在ViewPager中添加一个方法，用于在切换内容时，触发ViewPager重绘。
```java{6,8}
public void resetHeight(int current) {
    this.current = current;
    if (getChildCount()> current) {
        LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) getLayoutParams();
        if (layoutParams == null) {
            layoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0);
        } else {
            layoutParams.height = 0;
        }
            setLayoutParams(layoutParams);
    }
}
```

注意第6、8行，设置高度为0，让ViewPager重新绘制。

然后就要重写ViewPager的`onMeasure(int widthMeasureSpec, int heightMeasureSpec)`方法，获取到当前显示的子view，得到子view的高度，然后设置为ViewPager的高度，就达成自适应高度的目的。

```java{7,8}
@Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (getChildCount() > current) {
            View child = getChildAt(current);
            if (child != null) {
                child.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
                if (child instanceof WebView)
                    height = ((WebView) child).getContentHeight();
                else
                    height = child.getMeasuredHeight();
            }
        }
        heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
```
通过调用当前显示的子view的measure方法，测量出子view的高度，作为ViewPager的高度值。

注意7、8行，在上一步重写了WebView后，能正确获取到WebView内容的高度，所以此处调用WebView重写的获取高度方法。

一切就绪，只需要在`ViewPager.OnPageChangeListener.onPageScrolled(int position, float positionOffset, int positionOffsetPixels)`回调中调用ViewPager的`resetHeight(int position)`方法，就会触发ViewPager重绘，重绘后的ViewPager高度就能适应内容的高度了。

由于WebView的特殊性，需要在`WebViewClient.onPageFinished`回调中调用。
```java{8}
@Override
public void onPageFinished(WebView view, String url) {
    super.onPageFinished(view, url);
    view.postDelayed(new Runnable() {
        @Override
        public void run() {
            view.loadUrl("javascript:
            JavascriptInterface.getContentHeight(document.body.scrollHeight)");
        }
    },500);
}
```

第8行的`JavascriptInterface.getContentHeight(String value)`方法是js调用java层注入的方法，在java层调用`resetHeight(int position)`就能达到自适应WebView内容高度的目的。

```java
class JavascriptInterface{
    @android.webkit.JavascriptInterface
    public void getContentHeight(String value){
        if(!TextUtils.isEmpty(value) && null!=callback){
            callback.onHeightChange(mContentHeight =
                JUtils.dip2px(Integer.parseInt(value)));
        }
    }
}
```

