---
title: Android View Develop
date: 2017-03-22 22:07:04
tags:
 - Android
 - View
categories:
 - Android
---

View类是用户界面的基本组件组件。一个View在屏幕上占据了一个矩形区域,负责绘制和事件处理。View是一个基础部件,用来创建交互式UI组件(按钮、文本框等)。[ViewGroup](https://developer.android.com/reference/android/view/ViewGroup.html)子类是布局的基类,它是看不见的容器,包含着一些View(或viewgroup)和定义他们的布局属性。
# View
## Using Views
所有在window中显示的view组成了一棵View树。
一旦view树被创建，可以执行以下几类操作：
- 设置属性：通过代码或者布局
- 设置焦点：系统框架会处理焦点来响应用户输入，强制焦点到View上使用`requestFocus`。
- 设置Listener
- 设置可见性：通过[setVisibility(int)](https://developer.android.com/reference/android/view/View.html#setVisibility(int))

## Implementing a Custom View
实现一个自定义的View,可以通过覆盖的一些View的方法。不过不需要覆盖所有这些方法。

<div class="wiz-table-body" style="overflow:auto"><table border="2" width="85%" align="center" style="font-size: 14px; margin-top: 0.5em; margin-right: 1em; margin-bottom: 1em; border-spacing: 0px; border: 0px; width: 877px; color: rgba(0, 0, 0, 0.682353); font-family: Roboto, sans-serif; font-variant-ligatures: normal; orphans: 2; widows: 2; background-color: rgb(247, 247, 247);"><thead><tr><th style="padding-right: 12px; padding-left: 12px; vertical-align: top; color: rgb(255, 255, 255); border-color: rgb(221, 221, 221); font-weight: normal; width: 139px; background-color: rgb(153, 153, 153);" class="wiz-selected-cell-multi">Category</th><th style="padding-right: 12px; padding-left: 12px; vertical-align: top; color: rgb(255, 255, 255); border-color: rgb(221, 221, 221); font-weight: normal; width: 396px; background-color: rgb(153, 153, 153);" class="wiz-selected-cell-multi">Methods</th><th style="padding-right: 12px; padding-left: 12px; vertical-align: top; color: rgb(255, 255, 255); border-color: rgb(221, 221, 221); font-weight: normal; width: 341px; background-color: rgb(153, 153, 153);">Description</th></tr></thead><tbody><tr><td rowspan="2" style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Creation</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;">Constructors</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px;"><span style="orphans: auto; text-align: start; text-indent: 0px; widows: 1; float: none; display: inline !important;">构造函数的一种形式为从代码创建,一种为布局文件创建。第二种形式需要解析和应用布局文件中定义的属性。</span></td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onFinishInflate()" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onFinishInflate()</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">在view和它的所有子view从xml中inflate之后调用。</td></tr><tr><td rowspan="3" style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Layout</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onMeasure(int, int)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onMeasure(int, int)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">为此view和它的子view确定测量要求</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onLayout(boolean, int, int, int, int)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onLayout(boolean, int, int, int, int)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当view为子元素分配尺寸和位置的时候调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onSizeChanged(int, int, int, int)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onSizeChanged(int, int, int, int)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当view的size变化时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Drawing</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onDraw(android.graphics.Canvas)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onDraw(android.graphics.Canvas)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当绘制view时调用</td></tr><tr><td rowspan="4" style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Event processing</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onKeyDown(int, android.view.KeyEvent)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onKeyDown(int, KeyEvent)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当按键事件发生时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onKeyUp(int, android.view.KeyEvent)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onKeyUp(int, KeyEvent)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当抬起按键时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onTrackballEvent(android.view.MotionEvent)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onTrackballEvent(MotionEvent)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当轨迹球移动时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onTouchEvent(android.view.MotionEvent)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onTouchEvent(MotionEvent)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当触摸事件发生时调用</td></tr><tr><td rowspan="2" style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Focus</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onFocusChanged(boolean, int, android.graphics.Rect)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onFocusChanged(boolean, int, android.graphics.Rect)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当焦点变化时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onWindowFocusChanged(boolean)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onWindowFocusChanged(boolean)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当包含view的窗口焦点变化时调用</td></tr><tr><td rowspan="3" style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 139px; background-color: inherit;">Attaching</td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onAttachedToWindow()" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onAttachedToWindow()</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当viwe attach到window上时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onDetachedFromWindow()" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onDetachedFromWindow()</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当viwe 从window detach时调用</td></tr><tr><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 396px; background-color: inherit;"><code style="font-size: 13px; color: rgb(0, 102, 0); font-stretch: normal; line-height: 18px; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><code style="font-stretch: normal; font-family: Consolas, 'Liberation Mono', Menlo, Monaco, Courier, monospace; -webkit-font-smoothing: subpixel-antialiased; margin-bottom: 0px;"><a href="https://developer.android.com/reference/android/view/View.html#onWindowVisibilityChanged(int)" style="color: rgb(3, 155, 229); text-decoration: none; margin-bottom: 0px;" target="_blank">onWindowVisibilityChanged(int)</a></code></code></td><td style="padding-right: 12px; padding-left: 12px; vertical-align: top; border-color: rgb(221, 221, 221); width: 341px; background-color: inherit;">当包含view的窗口可见性发生变化时调用</td></tr></tbody></table></div>


## IDs
view有一个整数id。这些id通常是分配在布局的XML文件,并用于查找特定的view在view树中。
定义：
```java
<Button
android:id="@+id/my_button"
android:layout_width="wrap_content"
android:layout_height="wrap_content"
android:text="@string/my_button_text"/>
```
获取：
```java
Button myButton = (Button) findViewById(R.id.my_button);

```
id不需要唯一,但最好唯一,以确保在获取id的view树中唯一。
## Position
[getLeft()](https://developer.android.com/reference/android/view/View.html#getLeft())和[getTop()](https://developer.android.com/reference/android/view/View.html#getTop())获取到的是当前view相对于父元素的位置，例如,当`getLeft()`返回20,这意味着View位于父View左边界的右边20像素的位置。
[getRight()](https://developer.android.com/reference/android/view/View.html#getRight())和[getBottom()](https://developer.android.com/reference/android/view/View.html#getBottom())同理。例如,调用`getRight()`类似于以下计算:`getLeft()` + `getWidth()`

## Size, padding and margins
View 实际上有两对宽度和高度值。

第一对是测量值，表示view想要多大，测量值通过[getMeasuredWidth()](https://developer.android.com/reference/android/view/View.html#getMeasuredWidth()) 和 [getMeasuredHeight()](https://developer.android.com/reference/android/view/View.html#getMeasuredHeight()) 获取。

第二对就是view的绘制宽高，代表view在屏幕上绘制的真实宽高。这两个值和测量值有可能是相同的。通过[getWidth()](https://developer.android.com/reference/android/view/View.html#getWidth()) 和 [getHeight()](https://developer.android.com/reference/android/view/View.html#getHeight()) 获取。

测量值是包括view的padding的，padding可以通过[setPadding(int,int,int,int)](https://developer.android.com/reference/android/view/View.html#setPadding(int, int, int, int)) 和 [setPaddingRelative(int,int,int,int)](https://developer.android.com/reference/android/view/View.html#setPaddingRelative(int, int, int, int))设置。可以通过`getPaddingxxx()`获取。

View可以定义padding，不能定义margins。ViewGroup可以定义margins。可以查看[ViewGroup](https://developer.android.com/reference/android/view/ViewGroup.html) 和 [ViewGroup.MarginLayoutParams](https://developer.android.com/reference/android/view/ViewGroup.MarginLayoutParams.html) .

## Layout

`Layout`分为两步：measure和layout。

测量过程是实现[measure(int,int)](https://developer.android.com/reference/android/view/View.html#measure(int, int)) 方法，并且**自顶向下**递归遍历view树，同时计算出测量值并保存在view里。

layout过程是实现[layout(int,int,int,int)](https://developer.android.com/reference/android/view/View.html#layout(int, int, int, int)) 方法，同样是**自顶向下**遍历view树。在layout过程中，每一个父view使用measure过程得到的测量值计算定位他包含的子view的位置。

当view的`measure()`方法返回后，代表着当前view和他所包含的所有子view的 [getMeasuredWidth()](https://developer.android.com/reference/android/view/View.html#getMeasuredWidth()) 和[getMeasuredHeight()](https://developer.android.com/reference/android/view/View.html#getMeasuredHeight()) 值已经被设置。view的宽度和高度测量值必须在父view的约束范围内。父View可能会多次调用`measure()`测量子view。

measure过程中，[View.MeasureSpec](https://developer.android.com/reference/android/view/View.MeasureSpec.html)表示view想要怎么测量和怎么摆放位置，这个值是传递给父View的。`LayoutParams`表示子view想要多大。

`LayoutParams`有以下几种值：

- 确切的数值
- MATCH_PARENT 表示view想和父view一样大（不包括padding）
- WRAP_CONTENT 表示view只想要包裹住内容（包括padding）



`MeasureSpecs`包含以下几种：

- UNSPECIFIED 表示父view通过measure确定子view的测量值
- EXACTLY 表示父view规定确切的值给子view
- AT_MOST 表示父viwe规定子view的最大值

layout过程是通过调用[requestLayout](https://developer.android.com/reference/android/view/View.html#requestLayout()) 开始的。

## Drawing

Drawing就是在屏幕上绘制最新改变的区域。

绘制的顺序是从父元素到子元素，兄弟元素按照添加到View树的顺序绘制。如果View有背景，背景的绘制在`onDraw()`之前。子View的绘制顺序能通过ViewGroup中[setChildrenDrawingOrderEnabled(boolean)](https://developer.android.com/reference/android/view/ViewGroup.html#setChildrenDrawingOrderEnabled(boolean)) 开启设置，使用[setZ(float)](https://developer.android.com/reference/android/view/View.html#setZ(float)) 设置顺序。

强制使View 绘制，调用[invalidate()](https://developer.android.com/reference/android/view/View.html#invalidate())。

## Event Handling and Threading

View的事件循环包括以下几个步骤：

1. 一个事件触发并且分发到合适的view上，此view处理事件，通知listeners。
2. 在处理事件的过程中，如果view的边界大小发生改变，view会调用`requestLayout()`。
3. 同样，在此过程中，如果view的外观样式发生改变，view会调用`invalidate()`。
4. 如果`requestLayout()`或者`invalidate()`被调用，android的view系统会在适当的时候调用measure，layout，draw流程。

注意：view树的measure、layout、draw都在主线程进行，如果需要在子线程更新view，需要使用[Handler](https://developer.android.com/reference/android/os/Handler.html)。

## Focus Handling

Fragwork会处理焦点变化来响应用户输入。当view被removed、hidden和可用时，都会触发焦点变化。通过[isFocusable()](https://developer.android.com/reference/android/view/View.html#isFocusable()) 判断view是否能获取焦点。通过[setFocusable(boolean)](https://developer.android.com/reference/android/view/View.html#setFocusable(boolean)) 设置可否获取焦点。当view处在touch mode时，分别通过[isFocusableInTouchMode()](https://developer.android.com/reference/android/view/View.html#isFocusableInTouchMode()) 和[setFocusInTouchMode(boolean)](https://developer.android.com/reference/android/view/View.html#setFocusableInTouchMode(boolean)) 。



焦点变化基于最接近算法实现的。可以修改默认算法，通过在xml文件设置属性，

> nextFocusDown
nextFocusLeft
nextFocusRight
nextFocusUp



主动获取焦点通过[requestFocus()](https://developer.android.com/reference/android/view/View.html#requestFocus()) 方法。

## Touch Mode

当用户通过键盘或者方向键操作界面的时候，需要显示当前指向条目的焦点，让用户可以感知输入。如果设备可以触摸，就不需要高亮或者显示可看到的焦点。这种模式就是`Touch Mode`。

当设置处于Touch Mode时，只有设置`isFocusableInTouchMode`的view才能获取到焦点，比如text输入控件。其它的一些可触摸的view，比如Button，在被触摸到时候不会获取到焦点，只是触发click listener。

用户在任何时候出发方向键，都会使view退出touch mode，并且让view获取到焦点，使用户可以使用方向键交互。

`Touch Mode`的维护是在[Activity](https://developer.android.com/reference/android/app/Activity.html) 里。调用[isInTouchMode()](https://developer.android.com/reference/android/view/View.html#isInTouchMode()) 判断是否处于touch mode。

## Scrolling

Framework提供了对view内容滚动的支持。包括跟踪记录X和Y轴的 scroll offset和画滚动条的原理一样。查看[scrollBy(int, int)](https://developer.android.com/reference/android/view/View.html#scrollBy(int, int)) 、[scrollTo(int, int)](https://developer.android.com/reference/android/view/View.html#scrollTo(int, int))和[awakenScrollBars()](https://developer.android.com/reference/android/view/View.html#awakenScrollBars())这三个API。

## Tags

和id不一样，tags是用来在view中储存数据的，方便使用。可以在xml里调用，用[andrid:tag](https://developer.android.com/reference/android/R.styleable.html#View_tag)属性：

```xml

<View ...android:tag="@string/mytag_value" />

```

在代码中设置tags使用[setTag(Object)](https://developer.android.com/reference/android/view/View.html#setTag(java.lang.Object)) 和 [setTag(int , Object)](https://developer.android.com/reference/android/view/View.html#setTag(int, java.lang.Object))。

## Themes

默认情况下，view的创建通过把theme 的context对象传入构造方法。要使用不同主题通过设置[android:theme](https://developer.android.com/reference/android/R.styleable.html#View_theme)属性，或者传递[ContextThemeWrapper](https://developer.android.com/reference/android/view/ContextThemeWrapper.html)到构造方法中。

当设置`android：theme`属性后，自定义的主题会被设置到最顶层的inflation context中(可以查看 [LayoutInflater](https://developer.android.com/reference/android/view/LayoutInflater.html))，被用在他自身和所有子元素中。

## Properties
View暴露了[ALPHA](https://developer.android.com/reference/android/view/View.html#ALPHA)属性，和一些transform变换有关的属性，比如[TRANSLATION_X](https://developer.android.com/reference/android/view/View.html#TRANSLATION_X)和[TRANSLATION_Y](https://developer.android.com/reference/android/view/View.html#TRANSLATION_Y)。这些属性设置view的一些和绘制有关的持久状态，这些属性和方法也用在[Animator](https://developer.android.com/reference/android/animation/Animator.html)中。

## Animation
从Anroid 3.0开始，做view动画的最好方式是使用[android.animation](https://developer.android.com/reference/android/animation/package-summary.html)包中的API。主要通过改变view对象的属性值，比如`alpha`和`tanslationX`等实现动画。相比较于3.0之前的[Animation](https://developer.android.com/reference/android/view/animation/Animation.html)API，代替了只改变view绘制方式的动画实现。尤其是[ViewPropertyAnimator](https://developer.android.com/reference/android/view/ViewPropertyAnimator.html)使改变view属性更加容易。


## Security

为了防止恶意的应用程序可能试图欺骗用户执行敏感操作，系统提供了一个触摸过滤机制,可用于安全访问敏感数据。

调用[setFilterTouchesWhenObscured(boolean)](https://developer.android.com/reference/android/view/View.html#setFilterTouchesWhenObscured(boolean))或者设置`andrid:filterTouchesWhenObscured`开启触摸过滤。开启过滤，当view被另一个可见view挡住后，系统会拒绝touch事件。此view将收不到任何事件。

更高粒度的控制可以使用[onFilterTouchEventForSecurity(MotionEvent)](https://developer.android.com/reference/android/view/View.html#onFilterTouchEventForSecurity(android.view.MotionEvent))去实现自定义的安全策略。可以查看[FLAG_WINDOW_IS_OBSCURED](https://developer.android.com/reference/android/view/MotionEvent.html#FLAG_WINDOW_IS_OBSCURED)。

# ViewGroup

ViewGroup是一个特殊的view,可以包含其他view(称为children)，ViewGroup 是布局和视图的基类容器。这个类还定义了[ViewGroup.LayoutParams](https://developer.android.com/reference/android/view/ViewGroup.LayoutParams.html)类作为基类的布局参数。

```java

import android.content.Context;

import android.content.res.TypedArray;

import android.util.AttributeSet;

import android.view.Gravity;

import android.view.View;

import android.view.ViewGroup;

import android.widget.RemoteViews;



/**

 * Example of writing a custom layout manager.  This is a fairly full-featured

 * layout manager that is relatively general, handling all layout cases.  You

 * can simplify it for more specific cases.

 */

@RemoteViews.RemoteView

public class CustomLayout extends ViewGroup {

    /** The amount of space used by children in the left gutter. */

    private int mLeftWidth;



    /** The amount of space used by children in the right gutter. */

    private int mRightWidth;



    /** These are used for computing child frames based on their gravity. */

    private final Rect mTmpContainerRect = new Rect();

    private final Rect mTmpChildRect = new Rect();



    public CustomLayout(Context context) {

        super(context);

    }



    public CustomLayout(Context context, AttributeSet attrs) {

        this(context, attrs, 0);

    }



    public CustomLayout(Context context, AttributeSet attrs, int defStyle) {

        super(context, attrs, defStyle);

    }



    /**

     * Any layout manager that doesn't scroll will want this.

     */

    @Override

    public boolean shouldDelayChildPressedState() {

        return false;

    }



    /**

     * Ask all children to measure themselves and compute the measurement of this

     * layout based on the children.

     */

    @Override

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

        int count = getChildCount();



        // These keep track of the space we are using on the left and right for

        // views positioned there; we need member variables so we can also use

        // these for layout later.

        mLeftWidth = 0;

        mRightWidth = 0;



        // Measurement will ultimately be computing these values.

        int maxHeight = 0;

        int maxWidth = 0;

        int childState = 0;



        // Iterate through all children, measuring them and computing our dimensions

        // from their size.

        for (int i = 0; i < count; i++) {

            final View child = getChildAt(i);

            if (child.getVisibility() != GONE) {

                // Measure the child.

                measureChildWithMargins(child, widthMeasureSpec, 0, heightMeasureSpec, 0);



                // Update our size information based on the layout params.  Children

                // that asked to be positioned on the left or right go in those gutters.

                final LayoutParams lp = (LayoutParams) child.getLayoutParams();

                if (lp.position == LayoutParams.POSITION_LEFT) {

                    mLeftWidth += Math.max(maxWidth,

                            child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);

                } else if (lp.position == LayoutParams.POSITION_RIGHT) {

                    mRightWidth += Math.max(maxWidth,

                            child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);

                } else {

                    maxWidth = Math.max(maxWidth,

                            child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);

                }

                maxHeight = Math.max(maxHeight,

                        child.getMeasuredHeight() + lp.topMargin + lp.bottomMargin);

                childState = combineMeasuredStates(childState, child.getMeasuredState());

            }

        }



        // Total width is the maximum width of all inner children plus the gutters.

        maxWidth += mLeftWidth + mRightWidth;



        // Check against our minimum height and width

        maxHeight = Math.max(maxHeight, getSuggestedMinimumHeight());

        maxWidth = Math.max(maxWidth, getSuggestedMinimumWidth());



        // Report our final dimensions.

        setMeasuredDimension(resolveSizeAndState(maxWidth, widthMeasureSpec, childState),

                resolveSizeAndState(maxHeight, heightMeasureSpec,

                        childState << MEASURED_HEIGHT_STATE_SHIFT));

    }



    /**

     * Position all children within this layout.

     */

    @Override

    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {

        final int count = getChildCount();



        // These are the far left and right edges in which we are performing layout.

        int leftPos = getPaddingLeft();

        int rightPos = right - left - getPaddingRight();



        // This is the middle region inside of the gutter.

        final int middleLeft = leftPos + mLeftWidth;

        final int middleRight = rightPos - mRightWidth;



        // These are the top and bottom edges in which we are performing layout.

        final int parentTop = getPaddingTop();

        final int parentBottom = bottom - top - getPaddingBottom();



        for (int i = 0; i < count; i++) {

            final View child = getChildAt(i);

            if (child.getVisibility() != GONE) {

                final LayoutParams lp = (LayoutParams) child.getLayoutParams();



                final int width = child.getMeasuredWidth();

                final int height = child.getMeasuredHeight();



                // Compute the frame in which we are placing this child.

                if (lp.position == LayoutParams.POSITION_LEFT) {

                    mTmpContainerRect.left = leftPos + lp.leftMargin;

                    mTmpContainerRect.right = leftPos + width + lp.rightMargin;

                    leftPos = mTmpContainerRect.right;

                } else if (lp.position == LayoutParams.POSITION_RIGHT) {

                    mTmpContainerRect.right = rightPos - lp.rightMargin;

                    mTmpContainerRect.left = rightPos - width - lp.leftMargin;

                    rightPos = mTmpContainerRect.left;

                } else {

                    mTmpContainerRect.left = middleLeft + lp.leftMargin;

                    mTmpContainerRect.right = middleRight - lp.rightMargin;

                }

                mTmpContainerRect.top = parentTop + lp.topMargin;

                mTmpContainerRect.bottom = parentBottom - lp.bottomMargin;



                // Use the child's gravity and size to determine its final

                // frame within its container.

                Gravity.apply(lp.gravity, width, height, mTmpContainerRect, mTmpChildRect);



                // Place the child.

                child.layout(mTmpChildRect.left, mTmpChildRect.top,

                        mTmpChildRect.right, mTmpChildRect.bottom);

            }

        }

    }



    // ----------------------------------------------------------------------

    // The rest of the implementation is for custom per-child layout parameters.

    // If you do not need these (for example you are writing a layout manager

    // that does fixed positioning of its children), you can drop all of this.



    @Override

    public LayoutParams generateLayoutParams(AttributeSet attrs) {

        return new CustomLayout.LayoutParams(getContext(), attrs);

    }



    @Override

    protected LayoutParams generateDefaultLayoutParams() {

        return new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

    }



    @Override

    protected ViewGroup.LayoutParams generateLayoutParams(ViewGroup.LayoutParams p) {

        return new LayoutParams(p);

    }



    @Override

    protected boolean checkLayoutParams(ViewGroup.LayoutParams p) {

        return p instanceof LayoutParams;

    }



    /**

     * Custom per-child layout information.

     */

    public static class LayoutParams extends MarginLayoutParams {

        /**

         * The gravity to apply with the View to which these layout parameters

         * are associated.

         */

        public int gravity = Gravity.TOP | Gravity.START;



        public static int POSITION_MIDDLE = 0;

        public static int POSITION_LEFT = 1;

        public static int POSITION_RIGHT = 2;



        public int position = POSITION_MIDDLE;



        public LayoutParams(Context c, AttributeSet attrs) {

            super(c, attrs);



            // Pull the layout param values from the layout XML during

            // inflation.  This is not needed if you don't care about

            // changing the layout behavior in XML.

            TypedArray a = c.obtainStyledAttributes(attrs, R.styleable.CustomLayoutLP);

            gravity = a.getInt(R.styleable.CustomLayoutLP_android_layout_gravity, gravity);

            position = a.getInt(R.styleable.CustomLayoutLP_layout_position, position);

            a.recycle();

        }



        public LayoutParams(int width, int height) {

            super(width, height);

        }



        public LayoutParams(ViewGroup.LayoutParams source) {

            super(source);

        }

    }

}

```

在res/values/attrs.xml:中定义属性

```xml

<declare-styleable name="CustomLayoutLP">

    <attr name="android:layout_gravity" />

    <attr name="layout_position">

        <enum name="middle" value="0" />

        <enum name="left" value="1" />

        <enum name="right" value="2" />

    </attr>


</declare-styleable>

```

使用方法：

```java

<com.example.android.apis.view.CustomLayout

        xmlns:android="http://schemas.android.com/apk/res/android"

        xmlns:app="http://schemas.android.com/apk/res/com.example.android.apis"

        android:layout_width="match_parent"

        android:layout_height="match_parent">



    <!-- put first view to left. -->

    <TextView

            android:background="@drawable/filled_box"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            app:layout_position="left"

            android:layout_gravity="fill_vertical|center_horizontal"

            android:text="l1"/>



    <!-- stack second view to left. -->

    <TextView

            android:background="@drawable/filled_box"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            app:layout_position="left"

            android:layout_gravity="fill_vertical|center_horizontal"

            android:text="l2"/>



    <!-- also put a view on the right. -->

    <TextView

            android:background="@drawable/filled_box"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            app:layout_position="right"

            android:layout_gravity="fill_vertical|center_horizontal"

            android:text="r1"/>



    <!-- by default views go in the middle; use fill vertical gravity -->

    <TextView

            android:background="@drawable/green"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            android:layout_gravity="fill_vertical|center_horizontal"

            android:text="fill-vert"/>



    <!-- by default views go in the middle; use fill horizontal gravity -->

    <TextView

            android:background="@drawable/green"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            android:layout_gravity="center_vertical|fill_horizontal"

            android:text="fill-horiz"/>



    <!-- by default views go in the middle; use top-left gravity -->

    <TextView

            android:background="@drawable/blue"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            android:layout_gravity="top|left"

            android:text="top-left"/>



    <!-- by default views go in the middle; use center gravity -->

    <TextView

            android:background="@drawable/blue"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            android:layout_gravity="center"

            android:text="center"/>



    <!-- by default views go in the middle; use bottom-right -->

    <TextView

            android:background="@drawable/blue"

            android:layout_width="wrap_content"

            android:layout_height="wrap_content"

            android:layout_gravity="bottom|right"

            android:text="bottom-right"/>



</com.example.android.apis.view.CustomLayout>

```

参考：[Android Develper Reference View](https://developer.android.com/reference/android/view/View.html)