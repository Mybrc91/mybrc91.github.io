---
title: Surfaceview in Android
date: 2017-04-05 16:40:04
tags:
 - View
 - Android
categories:
 - Android
---

介绍一下Android中SurfaceView的原理

# 介绍

## Surface

简单的说Surface对应了一块屏幕缓冲区，每个window对应一个Surface，任何View都要画在Surface的Canvas上（后面有原因解释）。传统的view共享一块屏幕缓冲区，所有的绘制必须在UI线程中进行。

在SDK的文档中，对Surface的描述是这样的：“Handle onto a raw buffer that is being managed by the screen compositor”，翻译成中文就是“处理由屏幕显示内容合成器(screen compositor)所管理的原始缓冲区”，这句话包括下面两个意思：
1. 通过Surface就可以获得原始缓冲器以及其中的内容。
2. 原始缓冲区（a raw buffer）是用于保存当前窗口的像素数据的。
此外
3. Surface中有一个Canvas成员，专门用于画图的。

由以上的概括，我们总结如下：Surface中的Canvas成员是用来绘制的；其中的原始缓冲区是用来保存数据的地方。
Surface是用来管理数据的。

## SurfaceView

Surface的意思是表层，表面的意思，SurfaceView就是一个提供了专用Surface的View对象，SurfaceView负责把Surface显示到屏幕特定的位置上。View的绘制时在屏幕的上层的，如果我们使用了SurfaceView，可以理解为在屏幕上挖了一个洞来放置SurfaceView的Surface，而在SurfaceView上绘制的图像是在Surface上。如果你画的是半透明的，那么你将可以透过你画的东西看到Surface本身。所以View可以显式在SurfaceView之上，你也可以添加一些层在SurfaceView之上。

SurfaceView还有其他的特性，上面我们讲了它可以控制帧数，那它是什么控制的呢？这就需要了解它的使用机制。一般在很多游戏设计中，我们都是开辟一个后台线程计算游戏相关的数据，然后根据这些计算完的新数据再刷新视图对象，由于对View执行绘制操作只能在UI线程上， 所以当你在另外一个线程计算完数据后，你需要调用View.invalidate方法通知系统刷新View对象，所以游戏相关的数据也需要让UI线程能访问到，这样的设计架构比较复杂。由于View的更新只能在UI线程中，所以使用自定义View没办法这么做，但是SurfaceView就可以了。它一个特性就是允许其他线程(不是UI线程)绘制图形(使用Canvas)，根据它这个特性，你就可以控制它的帧数，你如果让这个线程1秒执行50次绘制，那么最后显示的就是50帧。

SurfaceView继承自View,通过查看SurfaceView的源码：
```java
...
 if (mWindow == null) {
         mWindow = new MyWindow(this);
         mLayout.type = mWindowType;
         mLayout.gravity = Gravity.LEFT|Gravity.TOP;
         mSession.addWithoutInputChannel(mWindow, mWindow.mSeq, mLayout,
         mVisible ? VISIBLE : GONE, mContentInsets);
   }
...

```

可以看到每个SurfaceView创建的时候都会创建一个MyWindow，new MyWindow(this)中的this正是SurfaceView自身，因此将SurfaceView和window绑定在一起，一个window对应一个Surface，因此SurfaceView中包含一个自己的Surface，SurfaceView就是展示Surface中数据的地方，同时可以认为SurfaceView是用来控制Surface中View的位置和尺寸的。

View的绘制是通过系统调用`onDraw`方法实现的，系统通过VSYNC机制每16ms绘制一次view，所以最多不会超过60帧。由于view的绘制是系统去调用的，我们只能通过view的`invalidate`方法去通知系统绘制，所以我们无法控制view绘制的帧数，在一些帧率要求高的场景无法实现需求。而SurfaceView它能弥补View的一些不足。传统View及其派生类的更新只能在UI线程，然而UI线程还同时处理其他交互逻辑，这就无法保证View更新的速度和帧率了，而SurfaceView可以用独立的线程进行绘制，因此可以提供更高的帧率，例如游戏，摄像头取景等场景就比较适合SurfaceView来实现。

## SurfaceHolder
SurfaceHolder是一个接口，其作用就像一个关于Surface的监听器，提供访问和控制SurfaceView内嵌的Surface 相关的方法。它通过三个回调方法，让我们可以感知到Surface的创建、销毁或者改变。

在SurfaceView中有一个方法getHolder，可以很方便地获得SurfaceView内嵌的Surface所对应的监听器接口SurfaceHolder。

除下面将要提到的SurfaceHolder.Callback外，SurfaceHolder还提供了很多重要的方法，其中最重要的就是：

1. `abstract void addCallback(SurfaceHolder.Callbackcallback)`：为SurfaceHolder添加一个SurfaceHolder.Callback回调接口。
2. `abstract Canvas lockCanvas()`：获取一个Canvas对象，并锁定之。所得到的Canvas对象，其实就是Surface中一个成员。
3. `abstract Canvas lockCanvas(Rect  dirty)`：同上。但只锁定dirty所指定的矩形区域，因此效率更高。
4. `abstract void unlockCanvasAndPost(Canvas  canvas)`：当修改Surface中的数据完成后，释放同步锁，并提交改变，然后将新的数据进行展示，同时Surface中相关数据会被丢失。

2、3、4中的同步锁机制的目的，就是为了在绘制的过程中，Surface中的数据不会被改变。lockCanvas是为了防止同一时刻多个线程对同一canvas写入。

总结：从设计模式的高度来看，Surface、SurfaceView和SurfaceHolder实质上就是广为人知的MVC，即Model-View-Controller。Model就是模型的意思，或者说是数据模型，或者更简单地说就是数据，也就是这里的Surface；View即视图，代表用户交互界面，也就是这里的SurfaceView；SurfaceHolder很明显可以理解为MVC中的Controller（控制器）。

### SurfaceHolder.Callback
SurfaceHolder.Callback主要是当底层的Surface被创建、销毁或者改变时提供回调通知，由于绘制必须在Surface被创建后才能进行，因此SurfaceHolder.Callback中的surfaceCreated 和surfaceDestroyed就成了绘图处理代码的边界。

SurfaceHolder.Callback中定义了三个接口方法：
1. `abstract void surfaceChanged(SurfaceHolder holder, int format, int width, int height)`：当surface发生任何结构性的变化时（格式或者大小），该方法就会被立即调用。
2. `abstract void surfaceCreated(SurfaceHolder holder)`：当surface对象创建后，该方法就会被立即调用。
3. `abstract void  surfaceDestroyed(SurfaceHolder holder)`：当surface对象在将要销毁前，该方法会被立即调用。

# View绘制
首先我们先写一个自定义View实现动画效果
```java
public class AnimateView extends View{
    private int radius = 10;
    private Paint paint;
    public AnimateView(Context context) {
        super(context);
        init();
    }

    private void init() {
        paint = new Paint();
        paint.setColor(Color.RED);
        paint.setStyle(Paint.Style.STROKE);
    }

    public AnimateView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public AnimateView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }



    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.translate(200 ,200);
        canvas.drawCircle(0 , 0 ,radius++ , paint);
        if (radius >=100){
            radius = 10;
        }
        invalidate();
    }
}
```


运行上面的View，你将看到一个圆圈，它原始半径是10，然后不断的变大，直到达到100后又恢复到10，这样循环显示，视觉效果上说你将看到一个逐渐变大的圆圈。它能做的只是简单的动画效果，具有一些局限性。首先你无法控制动画的显示速度，目前它是以最快的 速度显示，但是当你要更快，获取帧数更高的动画呢？ 因为View的帧数是由系统控制的，所以你没办法完成上面的操作。如果你需要编写一个游戏，它需要的帧数比较高，那么View就无能为力了，因为它被设计出来时本来就不是用来处理一些高帧数显示的。你可以把View理解为一个经过系统优化的，可以用来高效的执行一些帧数比较低动画的对象，它具有特定的使用场景，比如有一些帧数较低的游戏就可以使用它来完成：贪吃蛇、俄罗斯方块、棋牌类等游戏，因为这些游戏执行的帧数都很低。但是如果是一些实时类的游戏，如射击游戏、塔防游戏、RPG游戏等就没办法使用View来做，因为它的帧数太低了，会导致动画执行不顺畅。所以我们需要一个能自己控制执行帧数的对象，SurfaceView因此诞生了。

# SurfaceView用法

首先SurfaceView也是一个View，它也有自己的生命周期。由于SurfaceView的绘制可以在子线程执行，所以要注意以下两条：
- 需要正确的同步状态到UI线程，比如触摸事件
- 确保UI线程的绘制处于`SurfaceHolder.Callback.surfaceCreated()`和`SurfaceHolder.Callback.surfaceDestroyed()`生命周期之间

代码实例

```java
public class AnimateSurfaceView extends SurfaceView implements SurfaceHolder.Callback{

    private AnimateThread mWorkThread;

    private ReentrantLock lock =new ReentrantLock();
    public AnimateSurfaceView(Context context) {
        super(context);
        init();
    }

    public AnimateSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public AnimateSurfaceView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    private void init() {
        SurfaceHolder holder = getHolder();
        holder.addCallback(this);
        mWorkThread = new AnimateThread(holder , getContext() );
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        mWorkThread.start();

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        mWorkThread.isRunning = false;
        try {
            mWorkThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}

public class AnimateThread extends Thread{

    private SurfaceHolder mHolder;
    private Context mContext;
    public boolean isRunning;
    private    float radius = 10f;

    private Paint mPaint;




    public AnimateThread(SurfaceHolder holder, Context context) {
        mHolder = holder;
        mContext = context;
        isRunning = true;

        mPaint = new Paint();
        mPaint.setColor(Color.RED);
        mPaint.setStyle(Paint.Style.STROKE);


    }


    @Override
    public void run() {
        super.run();
            while (isRunning){
                    Canvas canvas = mHolder.lockCanvas();
                    if (null == canvas)
                        continue;
                    canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.SRC);
                    canvas.drawColor(Color.WHITE);
                    try {

                        doDraw(canvas);
                        Thread.sleep(50);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        if (mHolder != null && canvas != null)
                            mHolder.unlockCanvasAndPost(canvas);

                    }
            }

    }

    private void doDraw(Canvas canvas) {
        canvas.translate(200 ,200);
        canvas.drawCircle(0 , 0 ,radius++ , mPaint);
        if (radius >=100){
            radius = 10;
        }
    }
}

```


上面代码我们在SurfaceView的构造方法中执行了init初始化方法，在这个方法里，我们先获取SurfaceView里的SurfaceHolder对象，然后通过它设置Surface的生命周期回调方法，使用AnimateSurfaceView类本身作为回调方法代理类。surfaceCreated方法，是当SurfaceView被显示时会调用的方法，所以你需要在此处开启绘制的线程，surfaceDestroyed方法是当SurfaceView被隐藏会销毁时调用的方法，在这里你可以关闭绘制的线程。上面代码编写了一个使用SurfaceView做的动画效果，它的效果跟上面自定义View的一样，但是这边的SurfaceView可以控制动画的帧数。在SurfaceView中内置一个Thread线程，这个线程的作用就是用来绘制图形，在SurfaceView中实例化一个Thread实例，一般这个操作会放在SurfaceView的构造方法中。然后通过在SurfaceView中的SurfaceHolder的生命周期回调方法中插入一些操作，当Surface被创建时(SurfaceView显示在屏幕中时)，开启Thread执行绘制，Thread会一直刷新SurfaceView对象，当SurfaceView被隐藏时就停止改线程释放资源。这边有几个地方要注意下：

1. 通过`SurfaceHolder.lockCanvas`方法获取Canvas对象，此操作是同步的，当操作完成后记得调用`SurfaceHolder.unlockCanvasAndPost`方法释放掉Canvas锁。
2. 在调用doDraw执行绘制时，因为SurfaceView的特点，它会保留之前绘制的图形，所以你需要先清空掉上一次绘制时留下的图形。(View则不会，它默认在调用View.onDraw方法时就自动清空掉视图里的东西)。
3. 记得在回调方法：onSurfaceDestroyed方法里将后台执行绘制的Thread关闭。



# 总结

通过上面的分析，现在大家应该会简单使用SurfaceView了，总的归纳起来SurfaceView和View不同之处有：

1. SurfaceView允许其他线程更新视图对象(执行绘制方法)而View不允许这么做，它只允许UI线程更新视图对象。
2. SurfaceView是放在其他最底层的视图层次中，所有其他视图层都在它上面，所以在它之上可以添加一些层，而且它不能是透明的。
3. 它执行动画的效率比View高，而且你可以控制帧数。
4. 因为它的定义和使用比View复杂，占用的资源也比较多，除非使用View不能完成，再用SurfaceView否则最好用View就可以。