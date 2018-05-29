# view事件体系

## view基础

### 位置参数

#### 四个坐标

- top
- left
- right
- bottom

>相对于父容器，坐标顶点在容器左上角



所以
```java
width = right - left
height = bottom - top
```

#### 3.0以后新增参数

- x
- y
- translationX
- translationY

>x、y是左上角相对于父容器的坐标
translationX、translationY是左上角相对于父容器的偏移值，默认0

所以

```java
x = left + translationX
y = top + translationY
```

>注意
view移动时，四个坐标的值表示原始信息，不会变。x、y、translationX、translationY会改变。

看一下属性动画时的各个坐标

### MotionEvent和TouchSlop

#### MotionEvent

触屏事件，典型的有以下几种:
- ACTION_DOWN
- ACTION_MOVE
- ACTION_UP

手指在屏幕上移动会产生一系列的MotionEvent事件。

MotionEvent提供获取点击事件位置的方法：

- getX
- getY
- getRawX
- getRawY

>getX、getY代表相对于当前View左上角的坐标
getRawX、getRawY代表相对于屏幕左上角的坐标

#### TouchSlop

`TouchSlop`代表滑动最小间隔，是个常量，用于处理滑动临界值等问题。

通过`ViewConfiguration.get(this).scaledTouchSlop`获取。

### VelocityTracker、GestureDetector和Scroller

#### VelocityTracker
速度追踪，用于获取x、y方向的滑动速度。

首先在OnTouchEvent事件中追踪当前触摸事件。

```kotlin
val velocityTracker = VelocityTracker.obtain()
velocityTracker.addMovement(event)
```

然后指定时间间隔，获取当前速度。
```kotlin
velocityTracker.computeCurrentVelocity(1000)
val xVelocity = velocityTracker.xVelocity
val yVelocity = velocityTracker.yVelocity
```

最后不使用时，重置VelocityTracker
```kotlin
velocityTracker.clear()
velocityTracker.recycle()
```


#### GestureDetector

收拾检测，辅助检测常见的触摸事件，单击、滑动、长按、双击等。

首先创建GestureDetector对象。
```kotlin
val gestureDetector = GestureDetector(this, object: GestureDetector.OnGestureListener{
            override fun onDown(e: MotionEvent?): Boolean {
            }

            override fun onFling(e1: MotionEvent?, e2: MotionEvent?, velocityX: Float, velocityY: Float): Boolean {
            }

            override fun onLongPress(e: MotionEvent?) {
            }

            override fun onScroll(e1: MotionEvent?, e2: MotionEvent?, distanceX: Float, distanceY: Float): Boolean {
            }

            override fun onShowPress(e: MotionEvent?) {
            }

            override fun onSingleTapUp(e: MotionEvent?): Boolean {
            }
        })

//解决长按屏幕后无法拖动的现象
gestureDetector.setIsLongpressEnabled(true)
```

然后接管待监听View的OnTouchEvent方法，在OnTouchEvent中添加如下：
```kotlin
val consume = mGestureDetector.onTouchEvent(event)
return consume
```

最后就是去接口中实现你想要的逻辑。也可以不用GestureDetector,直接在OnTouchEvent中实现，复杂的双击逻辑可以用GestureDetector。

#### Scroller

弹性滑动对象，用于实现View的平滑滑动。而不是scrollTo和scrollBy的瞬间滑动。Scroller本身无法滑动，需要和View的computeScroll方法配合完成。

代码如下，固定的步骤：

```kotlin

val scroller = Scroller(context)


fun smoothScrollTo(destX: Int, destY: Int) {
    val scrollX = scrollX
    val deltaX = destX - scrollX

    val scrollY = scrollY
    val deltaY = destY - scrollY

    //在1000毫秒内向destX,deltaY滑动
    scroller.startScroll(scrollX, scrollY, deltaX, deltaY, 1000)
    invalidate()
}

override fun computeScroll() {
    if (scroller.computeScrollOffset()) {
        scrollTo(scroller.currX, scroller.currY)
        postInvalidate()
    }
    super.computeScroll()
}
```

## View滑动

主要有三种实现方式：
1. scrollTo/scrollBy 方式
2. view平移动画
3. 设置view的LayoutParams使view重新布局

### scrollTo/scrollBy

scrollTo实现了基于所传递参数位置的绝对滑动，scrollBy调用了scrollTo,实现了基于当前位置的相对滑动。

`滑动过程中view的位置不会改变，改变的是view内容的位置`。用过view中的mScrollX和mScrollY来代表滑动的像素距离。

有以下公式：

>mScrollX = view的left - view内容的left
mScrollY = view的top - view内容的top

### 平移动画

操作translationX、translationY来实现view的平移动画。可以通过xml和属性动画的方式实现。
```xml
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:fillAfter="true"
    android:duration="100"
    >
    <translate
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="100"
        android:toYDelta="100"
        >
    </translate>

</set>
```

```kotlin
ObjectAnimator.ofFloat(textview, "translationX", 0f , 100f).setDuration(100).start()
```

用xml方式的view动画并没有改变view的位置参数，动画结束后，又恢复到原来的视觉位置，如果想保留动画结束的位置，要设置`android:fillAfter="true"`。由于view动画不能改变view的位置参数，所以移动时，动画的点击事件还在原处。属性动画没有上述问题。

### 改变布局参数

通过改变LayoutParams的各种布局参数，来完成动画。

```kotlin
val marginLayoutParams = textview.layoutParams as ViewGroup.MarginLayoutParams
marginLayoutParams.leftMargin += 100
marginLayoutParams.width += 100
textview.requestLayout()
//或者textview.setLayoutParams(marginLayoutParams)
```

### 对比

- scrollTo/scrollBy方式是系统提供的，方便使用。不影响点击事件，只滑动view内容，不滑动view本身。
- view动画不能改变view的属性，影响点击事件，适合不需要交互的动画。属性动画没明显缺点，适合复杂动画。
- 改变布局参数操作复杂，适合有交互的动画。


下面实现一个跟手滑动view，只能使用view动画和改变布局参数的方式，scrollTo/scrollBy无法实现。




