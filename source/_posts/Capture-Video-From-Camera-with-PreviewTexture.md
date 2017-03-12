---
title: Capture Video From Camera With TextureView
date: 2017-03-06 17:46:04
tags:
 - Multimedia
 - Video
 - Android
categories:
 - Multimedia
---

Android平台上通过camera获取预览数据完成图像采集的流程

### 创建TextureView

TextureView相比于SurfaceView拥有更好的性能，通过OpenGl渲染数据

### 给TextureView设置TextureView.SurfaceTextureListener

SurfaceTextureListener有几个回调方法，我们用到的只有

>       /**
         * Invoked when a {@link TextureView}'s SurfaceTexture is ready for use.
         * 
         * @param surface The surface returned by
         *                {@link android.view.TextureView#getSurfaceTexture()}
         * @param width The width of the surface
         * @param height The height of the surface
         */
   public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height);

可以在源码注释里看到，当TextureView创建好可以使用的时候回调此方法。

### 在onSurfaceTextureAvailable回调里开启Camera预览

初始化Camera，设置addCallbackBuffer和setPreviewCallbackWithBuffer，addCallbackBuffer设置每一帧图片的buffer大小，Android的Camera获取到的是yuv格式数据，所以width*height*3/2,设置PreviewCallback获取预览的每一帧数据。

### 在PreviewCallback回调里获取到预览数据

在回调里mCamera.addCallbackBuffer(arg0);

### 关键代码如下

```java

public class CameraView extends TextureView implements TextureView.SurfaceTextureListener {

	private SurfaceTexture mSurfaceTexture;// TextureView的surface
	

	private void startCameraPreview(SurfaceTexture surface) {
		setCameraParameter();
		mCamera.addCallbackBuffer(new byte[mPreviewWidth * mPreviewHeight * 3 / 2]);
		mCamera.setPreviewCallbackWithBuffer(mCameraPreviewCallback);

		mCamera.startPreview();
	}

	public void destroyCamera() {
		if (mCamera != null) {
			mCamera.setPreviewCallbackWithBuffer(null);
			if (mIsPreviewing) {
				mCamera.stopPreview();
			}
			mCamera.release();
			mCamera = null;
		}
	}
	
	private void setCameraParameter() {
		try {
			Camera.Parameters parameters = mCamera.getParameters();
			parameters.setPreviewSize(mPreviewWidth, mPreviewHeight);
			mCamera.setParameters(parameters);
		} catch (Exception e) {

		}
	}

	private PreviewCallback mCameraPreviewCallback = new PreviewCallback() {

		@Override
		public void onPreviewFrame(byte[] arg0, Camera arg1) {
			byte[] resultData = arg0;
			long ts = System.currentTimeMillis();
			if (mIsPublishing) {
				int rorate;
				rorate = (mCameraId == CameraInfo.CAMERA_FACING_FRONT) ? LiveParam.CAMERA_FRONT : LiveParam.CAMERA_BACK;
				NativeLive.PushVideoData(resultData, rorate, ts);
			}
			mCamera.addCallbackBuffer(arg0);
		}
	};
	
	@Override
	public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
		try {
			mSurfaceTexture = surface;
			if (Build.VERSION.SDK_INT < 9) {
				mCamera = Camera.open();
			} else {
				mCamera = Camera.open(mCameraId);
			}
			startCameraPreview(surface);
		} catch (Exception e) {
			
			e.printStackTrace();
		}
	}
	
} 

```





