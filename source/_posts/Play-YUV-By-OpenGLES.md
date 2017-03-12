---
title: Play YUV By OpenGLES
date: 2017-03-06 20:46:04
tags:
 - Multimedia
 - Video
 - Android
categories:
 - Multimedia
---

Android平台上通过OpenGLES显示yuv数据

## 涉及到的知识点

### GLSurfaceView

先看一下源码定义

>  /*
    * An implementation of SurfaceView that uses the dedicated surface for
    * displaying OpenGL rendering.
    * <p>
    * A GLSurfaceView provides the following features:
    * <p>
    * <ul>
    * <li>Manages a surface, which is a special piece of memory that can be
    * composited into the Android view system.
    * <li>Manages an EGL display, which enables OpenGL to render into a surface.
    * <li>Accepts a user-provided Renderer object that does the actual rendering.
    * <li>Renders on a dedicated thread to decouple rendering performance from the
    * UI thread.
    * <li>Supports both on-demand and continuous rendering.
    * <li>Optionally wraps, traces, and/or error-checks the renderer's OpenGL calls.
    * </ul>
    */
 public class GLSurfaceView extends SurfaceView implements SurfaceHolder.Callback 

GLSurfaceView继承SurfaceView实现了SurfaceHolder.Callback接口，专用于显示OpenGL render的surface。
GLSurfaceView有以下几个特性
1. 管理一个Android View系统上的Surface,在专用内存区域上
2. 管理一个EGL 显示系统，使OpenGL能 render数据在surface
3. 需要一个用户自定义的Renderer去实现渲染显示
4. 为了提高性能，在GLSurfaceView内部有单独线程运行render，不在UI线程
5. 支持按需和持续渲染
6. 对于Renderer里的OpenGL方法调用，可以wraps，traces，和error-checks

### GLSurfaceView.Renderer

先看源码
>   /**
     * A generic renderer interface.
     * <p>
     * The renderer is responsible for making OpenGL calls to render a frame.
     * <p>
     * GLSurfaceView clients typically create their own classes that implement
     * this interface, and then call {@link GLSurfaceView#setRenderer} to
     * register the renderer with the GLSurfaceView.
     * <p>
     *
     * <h3>Threading</h3>
     * The renderer will be called on a separate thread, so that rendering
     * performance is decoupled from the UI thread. Clients typically need to
     * communicate with the renderer from the UI thread, because that's where
     * input events are received. Clients can communicate using any of the
     * standard Java techniques for cross-thread communication, or they can
     * use the {@link GLSurfaceView#queueEvent(Runnable)} convenience method.
     * <p>
     * <h3>EGL Context Lost</h3>
     * There are situations where the EGL rendering context will be lost. This
     * typically happens when device wakes up after going to sleep. When
     * the EGL context is lost, all OpenGL resources (such as textures) that are
     * associated with that context will be automatically deleted. In order to
     * keep rendering correctly, a renderer must recreate any lost resources
     * that it still needs. The {@link #onSurfaceCreated(GL10, EGLConfig)} method
     * is a convenient place to do this.
     *
     *
     * @see #setRenderer(Renderer)
     */
    public interface Renderer 

主要有以下两点需要注意：
1. 由于renderer运行在**子线程**，UI线程要和renderer所在的线程通信，可以使用任何java的进程通信技术，也可以用GLSurfaceView提供了一个queueEvent(Runnable)方法，实现方式是通过wait，notify，synchronized机制，具体可以深入源码查看。
2. EGL Context丢失问题，当设备从休眠中唤醒时可以出现context丢失问题。当context丢失时，所有和它相关联的OpenGL资源都将被自动删除，例如texture。为了是renderer运行正常，需要在onSurfaceCreated回调中初始化renderer需要的OpenGL资源。

### OpenGL坐标系统

#### 顶点坐标
	
OpenGLES 中坐标系统如下图所示：
![顶点坐标](/images/coordinates.png)

通过这个坐标系统映射到各种类型的设置屏幕，左图是OpenGL的坐标系统，右图是设备中映射的坐标系统，把各种类型的屏幕都当成正方形划分

#### 纹理坐标

OpenGLES 中的texture纹理坐标系统如下图所示：
![纹理坐标](/images/texture-coordinates.png)

纹理坐标的0，0点在左下角

### OpenGL 2.0 pipeline

OpenGL渲染管线pipeline包含从输入数据到输出成一张图片的所有流程，如下图所示：

![OpenGL 2.0 pipeline](/images/openglv2_pipeline.png) 

顶点坐标vertices，定义了要显示的形状。最终会转换成texture坐标显示，2D或3D。

> It all begins with the vertices, these are the points from which shapes like triangles will later be constructed. Each of these points is stored with certain attributes and it's up to you to decide what kind of attributes you want to store. Commonly used attributes are 3D position in the world and texture coordinates.

> The vertex shader is a small program running on your graphics card that processes every one of these input vertices individually. This is where the perspective transformation takes place, which projects vertices with a 3D world position onto your 2D screen! It also passes important attributes like color and texture coordinates further down the pipeline.

> After the input vertices have been transformed, the graphics card will form triangles, lines or points out of them. These shapes are called primitives because they form the basis of more complex shapes. There are some additional drawing modes to choose from, like triangle strips and line strips. These reduce the number of vertices you need to pass if you want to create objects where each next primitive is connected to the last one, like a continuous line consisting of several segments.

> The following step, the geometry shader, is completely optional and was only recently introduced. Unlike the vertex shader, the geometry shader can output more data than comes in. It takes the primitives from the shape assembly stage as input and can either pass a primitive through down to the rest of the pipeline, modify it first, completely discard it or even replace it with other primitive(s). Since the communication between the GPU and the rest of the PC is relatively slow, this stage can help you reduce the amount of data that needs to be transferred. With a voxel game for example, you could pass vertices as point vertices, along with an attribute for their world position, color and material and the actual cubes can be produced in the geometry shader with a point as input!

> After the final list of shapes is composed and converted to screen coordinates, the rasterizer turns the visible parts of the shapes into pixel-sized fragments. The vertex attributes coming from the vertex shader or geometry shader are interpolated and passed as input to the fragment shader for each fragment. As you can see in the image, the colors are smoothly interpolated over the fragments that make up the triangle, even though only 3 points were specified.

> The fragment shader processes each individual fragment along with its interpolated attributes and should output the final color. This is usually done by sampling from a texture using the interpolated texture coordinate vertex attributes or simply outputting a color. In more advanced scenarios, there could also be calculations related to lighting and shadowing and special effects in this program. The shader also has the ability to discard certain fragments, which means that a shape will be see-through there.

> Finally, the end result is composed from all these shape fragments by blending them together and performing depth and stencil testing. All you need to know about these last two right now, is that they allow you to use additional rules to throw away certain fragments and let others pass. For example, if one triangle is obscured by another triangle, the fragment of the closer triangle should end up on the screen.

> Now that you know how your graphics card turns an array of vertices into an image on the screen, let's get to work!

引用自 [https://open.gl](https://open.gl/drawing) 

#### Vertex（顶点）输入

创建顶点坐标，定义绘制区域

> float vertices[] = {
     0.0f,  0.5f, // Vertex 1 (X, Y)
     0.5f, -0.5f, // Vertex 2 (X, Y)
    -0.5f, -0.5f  // Vertex 3 (X, Y)
};

创建Vertex Buffer Object (VBO)对象，为了把顶点数据加载到GPU缓冲区

> mVbo = new int[2];
  GLES20.glGenBuffers(2, mVbo, 0); 

在数据真正加载到缓存区中，还要调用glBindBuffer方法

> GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, mVbo[0]);

glBindBuffer激活缓存区使顶点数据可以copy到内存里

> GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, sizeof(vertices), vertices,  GLES20.GL_STATIC_DRAW);

这个函数激活数组缓冲区。第二个参数指定字节数。最后一个参数是非常重要的,它决定顶点数据的使用方式
- **GL_STATIC_DRAW** : vertex数据加载一次，渲染多次
- **GL_DYNAMIC_DRAW** : vertex数据加载一次, 可能随时会改变, 也会渲染多次
- **GL_STREAM_DRAW** :  vertex数据加载一次，渲染一次

这种值将决定什么样的内存数据存储在你的显卡的最高效率。例如,与GL_STREAM_DRAW VBOs类型可能在内存中存储数据,允许更快的写和稍微慢渲染。

现在顶点数据已经存放到了GPU内存中，但是GPU还不知道怎么使用这些数据，下面将做的是告诉GPU如何处理顶点数据。

#### Shader（着色器）

我们需要指示GPU如何处理数据。必须实现顶点着色器（vertex shader）和片段着色器（fragment shader）来得到要绘制到屏幕上的数据,几何着色器（geometry shader）是可选的。

shader是c风格的语言称为GLSL(OpenGL着色语言)。OpenGL将从源代码编译程序在运行时并将其复制到GPU。

##### Vertex shader

顶点着色器程序处理顶点数组中每个顶点及其属性。它的职责是输出在屏幕设备坐标系统上的最终顶点位置和片段着色器需要的任何数据。这就是为什么3D转换应该发生在这里。片段着色器依赖各种属性比如颜色和纹理坐标,这通常是从输入直接输出,没有任何计算。

> in vec2 position;

> void main()
{
    gl_Position = vec4(position, 0.0, 1.0);
}

##### Fragment shader

顶点着色器的输出在屏幕上插值像素，这些像素被称为片段和片段着色器操作。就像顶点着色器有一个强制性的输出,片段着色器输出像素的颜色。计算从顶点开始的颜色,纹理坐标和任何来自顶点着色器的数据。

以下是显示白色的例子
> out vec4 outColor;

> void main()
{
    outColor = vec4(1.0, 1.0, 1.0, 1.0);
}

你会注意到,我们不使用一些内置变量输出颜色,如gl_FragColor。这是因为一个片段着色器可以实际上输出多个颜色,我们将会看到如何处理当加载这些着色器。outColor变量使用vec4类型,因为每个颜色由r、g、b、a组成。颜色在OpenGL通常表示为浮点数在0.0和1.0之间,而不是常见的0到255。

##### Compiling shader

从文件或硬编码的字符串加载着色器代码，然后编译着色器。就像顶点缓冲区VBO的创建一样,它也要创建一个着色器对象和加载数据。

> int vertexShader = GLES20.glCreateShader(GL_VERTEX_SHADER);
GLES20.glShaderSource(vertexShader, vertexSource);

然后编译shader，就可以被GPU执行了

> GLES20.glCompileShader(vertexShader);

如果shader出错，是无法通过glGetError捕获的。通过以下方式debug着色器的编译。

> Checking if a shader compiled successfully
```java 
   int[] status = new int[1];
   GLES20.glGetShaderiv(vertexShader, GLES20.GL_COMPILE_STATUS, status, 0);
   if (status[0] == 0){
        Log.e(TAG, "compile shader error");
        Log.e(TAG, GLES20.glGetShaderInfoLog(i));
        GLES20.glDeleteShader(i);
        vertexShader = status;
    }
```
If status is equal to GL_TRUE, then your shader was compiled successfully. 

获取编译日志
> char buffer[512];
   glGetShaderInfoLog(vertexShader, 512, NULL, buffer);

这将存储前511字节+null结尾的编译日志到指定的缓冲区。日志也可以记录有用的警告即使编译成功。

片段着色器编译也是一样的

> int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
GLES20.glShaderSource(fragmentShader,  fragmentSource);
GLES20.glCompileShader(fragmentShader);

##### Combining shaders into a program

直到现在为止顶点和片段着色器是两个独立的对象。虽然他们被组织起来一起工作,但他们还没有真正连接。这种联系是由这两个着色器创建一个program。

```java 
  int shaderProgram = GLES20.glCreateProgram();
  if (shaderProgram != 0) {
          GLES20.glAttachShader(shaderProgram, vertexShader);
          checkGlError("glAttachShader");
          GLES20.glAttachShader(shaderProgram, fragmentShader);
          checkGlError("glAttachShader");
  }
```
因为片段着色器允许写入多个缓冲区,需要显式地指定输出缓冲区。这需要在连接程序之前执行。然而,由于默认这是0,现在只有一个输出,以下代码没有必要:
> glBindFragDataLocation(shaderProgram, 0, "outColor");

使用glDrawBuffers当渲染多个缓冲区时,因为只有第一个输出缓冲区是默认启用的。

链接program

```java 
          GLES20.glLinkProgram(shaderProgram);
          int[] linkStatus = new int[1];
          GLES20.glGetProgramiv(shaderProgram, GLES20.GL_LINK_STATUS, linkStatus, 0);
          if (linkStatus[0] != GLES20.GL_TRUE) {
              Log.e(TAG, "Could not link shaderProgram: ");
              Log.e(TAG, GLES20.glGetProgramInfoLog(shaderProgram));
              GLES20.glDeleteProgram(shaderProgram);
              shaderProgram = 0;
          }
```
真正使用shader在program的调用：
> GLES20.glUseProgram(shaderProgram);

此时program才会在处于运行状态

##### Making the link between vertex data and attributes

虽然我们现在已经准备好了顶点数据和着色器,OpenGL仍然不知道这些属性的格式和顺序。首先需要获取输入顶点着色器的"position"属性引用:

> int positionAttrib = GLES20.glGetAttribLocation(shaderProgram, "position");

现在可以指定输入的数据是如何从数组中检索:
> GLES20.glVertexAttribPointer(positionAttrib, 2, GLES20.GL_FLOAT, false, 0, 0);

第一个参数是输入属性的引用。第二个参数指定输入值的数量,也就是vec的维度。第三个参数指定了每个组件的类型和第四个参数指定是否应规范化输入值在-1.0和1.0之间(或0.0和1.0根据格式),如果他们不是浮点数。

最后两个参数是最重要的因为他们指定属性在顶点数组中是如何布局的。第一个数字指定stride（步幅）,或数组中每个位置属性有多少字节。值0意味着之间没有数据。目前这种情况,每个顶点的位置立即紧随其后的是下一个顶点的位置。最后一个参数指定偏移量,或者从一开始就有多少字节数组的属性。因为没有其他属性,这是0。

重要的是要知道这个函数将存储不仅stride（步幅）和offset,还有绑定在GL_ARRAY_BUFFER上的VBOs。这意味着不必显式地绑定VBO当实际渲染的时候。这也意味着您可以使用不同的VBO给每个属性。

如果你不完全理解这点，后面通过函数调用可以添加更多的属性，现在顶点属性数组需要enable：
> GLES20.glEnableVertexAttribArray(positionAttrib);

##### Vertex Array Objects

真正的图形程序使用许多不同的着色器和vertex layouts实现各种需求和特殊效果。改变shader program 调用glUseProgram很简单,但它很不方便,如果你不得不每次都重新设置的所有属性。

幸运的是,OpenGL使用Vertex Array Objects (VAO)解决这个问题。VAOs存储所有的attributes和VBOs的link关系用raw vertex data。
创建一个VAO

> GLuint vao;
glGenVertexArrays(1, &vao);

绑定
> glBindVertexArray(vao);

一旦你绑定VAO,每次调用glVertexAttribPointer,这些信息将存储在VAO。这使得切换不同的顶点数据和顶点格式和绑定不同的VAO一样容易!记住,一个VAO不存储任何顶点数据本身,它只是引用VBOs和保存获取属性值的方法。

确保你已经创建并绑定VAO在程序的开始。任何绑定之前的VBO buffers都将被忽略

#### Drawing

现在已经加载了顶点数据,创建了着色程序和相关数据的属性,就可以绘制了。用于存储属性信息的VAO已经绑定,所以你不必担心。剩下的就是调用glDrawArrays在主循环:

> GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4);

第一个参数指定形状,第二个参数指定跳过开头多少个顶点和最后一个参数指定处理顶点的数量。

如果你什么都没看到,确保着色器编译正确,程序已经正确连接,VBO已经启用,VAO已经绑定在指定属性之前,你的顶点数据是正确的,glGetError返回0。

#### Uniforms

现在的白色三角形被硬编码到着色器代码,但是如果你想要在shader编译后改变它呢?vertex attributes并不是唯一的方法来传递数据到着色器程序。还有另一种方法将数据传递给着色器叫做*Uniforms*。这些本质上是全局变量,有相同的值为vertices或fragments。

一个uniform例子

> uniform vec3 triangleColor;
  out vec4 outColor;
void main()
{
    outColor = vec4(triangleColor, 1.0);
}

设置uniform和设置顶点属性类似，首先要获取location

> GLint uniColor = glGetUniformLocation(shaderProgram, "triangleColor");

可以使用任何glUniformXY函数改变uniform的值,其中X是数量，y是类型。常见的类型是float（f）、doudle（d）、int（i）。

> glUniform3f(uniColor, 1.0f, 0.0f, 0.0f);

如果运行程序,将看到红色。可以让颜色值随时间改变，显示的颜色也会变化。

#### Adding some more colors

虽然uniform可以改变运行时颜色，通过添加颜色属性到顶点数组中，也可以完成同样的效果。

> float vertices[] = {
     0.0f,  0.5f, 1.0f, 0.0f, 0.0f, // Vertex 1: Red
     0.5f, -0.5f, 0.0f, 1.0f, 0.0f, // Vertex 2: Green
    -0.5f, -0.5f, 0.0f, 0.0f, 1.0f  // Vertex 3: Blue
};

为了简单，没有添加a值
修改顶点着色器，使其输出颜色值到fragment着色器中

> in vec2 position;
in vec3 color;
out vec3 Color;
void main()
{
    Color = color;
    gl_Position = vec4(position, 0.0, 1.0);
}

把输出的颜色输入到fragment着色器中

> in vec3 Color;
out vec4 outColor;
void main()
{
    outColor = vec4(Color, 1.0);
}

注意输入输出的名字要统一

现在,我们只需要改变属性的引用，作用于X,Y,R,G,B属性顺序

> GLint posAttrib = glGetAttribLocation(shaderProgram, "position");
glEnableVertexAttribArray(posAttrib);
glVertexAttribPointer(posAttrib, 2, GL_FLOAT, GL_FALSE, 5*sizeof(float), 0);

> GLint colAttrib = glGetAttribLocation(shaderProgram, "color");
glEnableVertexAttribArray(colAttrib);
glVertexAttribPointer(colAttrib, 3, GL_FLOAT, GL_FALSE, 5*sizeof(float), (void*)(2*sizeof(float)));

效果自行测试

#### Element buffers

顶点数组指定了顶点的顺序绘制。如果你想添加另外的形状,您必须添加额外的顶点到顶点数组中。有一种方法来控制顺序，可以重用顶点。这可以节省你很多的内存当使用真正的3D模型时,因为每个点通常被多个形状使用。

element 数组是顶点数据bound在GL_ARRAY_BUFFER上的引用，使用方式如下：
> GLuint elements[] = {
    0, 1, 2
};

和顶点数组一样，通过VBO加载到内存中

> GLuint ebo;
glGenBuffers(1, &ebo);

> ...

> glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(elements), elements, GL_STATIC_DRAW);

唯一的不同在buffer的类型，使用***GL_ELEMENT_ARRAY_BUFFER***
真正使用elemen之前，要调用以下方法：
> glDrawElements(GL_TRIANGLES, 3, GL_UNSIGNED_INT, 0);

和glDrawArrays第一个参数是一样的,但是引用指向element缓冲区。第二个参数指定的element引用的个数,第三个参数指定元素的数据类型,最后一个参数指定偏移量。唯一的区别是使用element引用和顶点坐标。

下面来看一下使用element buffer的好处,让我们尝试使用两个三角形绘制一个矩形。我们首先不使用element buffer。

> float vertices[] = {
    -0.5f,  0.5f, 1.0f, 0.0f, 0.0f, // Top-left
     0.5f,  0.5f, 0.0f, 1.0f, 0.0f, // Top-right
     0.5f, -0.5f, 0.0f, 0.0f, 1.0f, // Bottom-right

>    0.5f, -0.5f, 0.0f, 0.0f, 1.0f, // Bottom-right
    -0.5f, -0.5f, 1.0f, 1.0f, 1.0f, // Bottom-left
    -0.5f,  0.5f, 1.0f, 0.0f, 0.0f  // Top-left
};

调用如下方式使用

> glDrawArrays(GL_TRIANGLES, 0, 6);

正确的情况下出现一个矩形,但顶点数据存在重复，浪费内存。使用element buffer,可以重用数据元素:

> float vertices[] = {
    -0.5f,  0.5f, 1.0f, 0.0f, 0.0f, // Top-left
     0.5f,  0.5f, 0.0f, 1.0f, 0.0f, // Top-right
     0.5f, -0.5f, 0.0f, 0.0f, 1.0f, // Bottom-right
    -0.5f, -0.5f, 1.0f, 1.0f, 1.0f  // Bottom-left
};

> ...

> GLuint elements[] = {
    0, 1, 2,
    2, 3, 0
};

> ...

> glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

element buffer指定6个顶点形成两个三角形,但现在我们可以重用顶点!当你的图形应用程序加载许多模型到相对较小的图形内存中,使用element缓冲区优化是很重要的。

### Textures objects and parameters

就像VBOs和VAOs一样,Textures生成首先调用以下函数：

> GLuint tex;
glGenTextures(1, &tex);

texture通常用于3D模型图像,但在现实中他们可以用来存储许多不同种类的数据。可以有1D,2D和3D texture,可以用来存储大量数据在GPU上。texture的另一个用途是存储terrain（地形） information。本文将关注使用的纹理图像,但原则普遍适用于各种各样的纹理。

和其他对象一样,texture必须绑定才能操作。由于图像是二维数组的像素,它将绑定到GL_TEXTURE_2D目标。
> glBindTexture(GL_TEXTURE_2D, tex);

像素绘制是通过纹理坐标实现的，这些坐标的范围从0.0到1.0，(0,0)是屏幕左下角，可参照上文的坐标图，(1,1)是纹理图像的右上角。按照纹理坐标来检索像素颜色信息被称为采样（samping）。有解决这个问题的不同方法,每个适合不同的场景。OpenGL为你提供了许多选项来控制这个采样是如何实现的,下面将讨论其中的常见问题。

#### Wrapping

你首先要考虑的是如何采样坐标范围之外的纹理坐标（0到1之外）。OpenGL提供了四种处理方法:
- **GL_REPEAT** : 整数部分（1.5中1被忽略）将被忽略，采用重复模式。
- **GL_MIRRORED_REPEAT** : 采用重复模式,如果整数部分是奇数将会是镜像重复。
- **GL_CLAMP_TO_EDGE** : 只采样0和1之间的坐标。
- **GL_CLAMP_TO_BORDER** : 超出范围的坐标将指定特殊颜色的边框。

这些解释可能仍然有点费解,下面来看看所有这些情况:

![处理方式](/images/gl_clamp.png)


纹理坐标的(x,y,z)叫做(s,t,r)

改变texture参数调用glTexParameter

> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

如果你使用GL_CLAMP_TO_BORDER改变边框颜色,通过设置RGBA浮点数组

> float color[] = { 1.0f, 0.0f, 0.0f, 1.0f };
glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, color);

#### Filtering

纹理坐标是和分辨率没有关联的,并不是匹配一个实际像素。纹理图像是会拉伸的相对于实际图像。OpenGL提供了各种方法来处理采样像素的颜色。这个过程称为过滤,可用以下方法:
- **GL_NEAREST** : 返回最近像素的坐标。
- **GL_LINEAR**: 返回围绕给定坐标的4个像素的加权平均值。
- **GL_NEAREST_MIPMAP_NEAREST**、**GL_LINEAR_MIPMAP_NEAREST** **GL_NEAREST_MIPMAP_LINEAR** **GL_LINEAR_MIPMAP_LINEAR** : 采样通过mipmaps

在讨论mipmaps之前,让我们首先看看GL_NEAREST和GL_LINEAR的差别。原始图像是16倍小于矩形光栅。

![filter](/images/gl_linear_nesrest.png)

虽然GL_LINEAR提供了一个平滑的结果,但它并不总是最理想的选择。GL_NEAREST更适合游戏中的8bit位图,就是像素图。

可以指定应该使用哪一种当放大或缩小图像时。这两种情况使用**GL_TEXTURE_MIN_FILTER** **GL_TEXTURE_MAG_FILTER**。

> glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

通过mipmaps过滤texture,mipmaps产生更小内存占用的texture。建议使用它们,因为质量更高和性能更好。

> glGenerateMipmap(GL_TEXTURE_2D);

采样就是调用上面的函数，必须先加载纹理图像然后再mipmap。

使用mipmap,有四种方法。
- **GL_NEAREST_MIPMAP_NEAREST** : 使用最接近像素的大小的mipmap，采样使用近邻插值
- **GL_LINEAR_MIPMAP_NEAREST** : 采样最近的mipmap使用线性插值
- **GL_NEAREST_MIPMAP_LINEAR** : 使用两个最接近像素的大小的mipmap，采样使用近邻插值
- **GL_LINEAR_MIPMAP_LINEAR** : 采样最近的两个mipmap使用线性插值

有一些其他结构参数可用,但他们适合专业操作。你可以读到他们的[规范](http://docs.gl/gl3/glTexParameter)。

### Loading texture images

texture对象已经配置好可以加载texture图像了。只需加载一组像素进去:

> float pixels[] = {
    0.0f, 0.0f, 0.0f,   1.0f, 1.0f, 1.0f,
    1.0f, 1.0f, 1.0f,   0.0f, 0.0f, 0.0f
};
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 2, 2, 0, GL_RGB, GL_FLOAT, pixels);

**GL_TEXTURE_2D** 后的第一个参数是代表图片等级,其中0是基础图像。这个参数可以用来加载自己的mipmap图像。第二个参数指定的内部像素格式,该格式的像素存储在GPU上。许多不同的格式是可用的,包括压缩格式。第三个和第四个参数指定图像的宽度和高度。第五个参数固定为0。接下来的两个参数描述最终加载的数组中的像素格式和最后一个参数指定了数组本身。函数开始加载图像坐标是(0,0)。

但是是像素数组本身如何建立?texture的加载在图形应用程序通常会比从文件加载更复杂。最佳实践是使用硬件支持的文件格式,但它可能会更方便从常见的图像格式加载texture如JPG和PNG。不幸的是OpenGL不能提供任何辅助函数加载像素从这些图像文件,但这就是第三方库派上用场了!比如SOIL库。

##### SOIL

简单使用如下：

> int width, height;
unsigned char* image =
    SOIL_load_image("img.png", &width, &height, 0, SOIL_LOAD_RGB);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB,
              GL_UNSIGNED_BYTE, image);

使用完后释放:

> SOIL_free_image_data(image);

#### Using a texture

纹理采样使用纹理坐标,你需要将这些作为属性添加到顶点。让我们修改上一个例子的纹理坐标。现在新的顶点数组将包含s和t坐标:
> float vertices[] = {
//  Position      Color             Texure coords
    -0.5f,  0.5f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, // Top-left
     0.5f,  0.5f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f, // Top-right
     0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f, // Bottom-right
    -0.5f, -0.5f, 1.0f, 1.0f, 1.0f, 0.0f, 1.0f  // Bottom-left
};

vertex shader 需要修改使 texture 坐标插值fragments shader:

> ...

> in vec2 texcoord;

> out vec3 Color;
> out vec2 Texcoord;

> ...

> void main()
{
    Texcoord = texcoord;

和颜色属性添加的时候一样, 属性引用需要适配新的格式:

> glVertexAttribPointer(posAttrib, 2, GL_FLOAT, GL_FALSE, 7*sizeof(float), 0);
> glVertexAttribPointer(colAttrib, 3, GL_FLOAT, GL_FALSE, 7*sizeof(float), (void*)(2*sizeof(float)));

> GLint texAttrib = glGetAttribLocation(shaderProgram, "texcoord");
> glEnableVertexAttribArray(texAttrib);
> glVertexAttribPointer(texAttrib, 2, GL_FLOAT, GL_FALSE, 7*sizeof(float), (void*)(5*sizeof(float)));

添加了两个texture坐标，一个顶点包含7个值，texture 坐标是两个浮点值表示。

还剩最后一步:提供fragment shader去采样像素。这是通过添加一个sampler2D的uniform,这将有一个默认值为0。只有访问多个纹理时才会变。

此处使用SOIL加载图片，确保它路径正确。

> int width, height;
unsigned char* image = SOIL_load_image("sample.png", &width, &height, 0, SOIL_LOAD_RGB);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
SOIL_free_image_data(image);

用sampler从2D纹理采样像素,函数把采样器和纹理坐标作为参数。我们也会用采样颜色与颜色属性来获得一个有趣的效果。你的片段着色器将现在看起来像这样:

> in vec3 Color;
> in vec2 Texcoord;

> out vec4 outColor;

> uniform sampler2D tex;

> void main()
{
    outColor = texture(tex, Texcoord) * vec4(Color, 1.0);
}

##### Texture units

fragment shader的sampler绑定Texture units 0。Texture units是对texture对象的引用,可以在shader中被采样。texture绑定tuxture units使用glBindTexture函数。因为没有显式地指定要使用的纹理单元,所以绑定GL_TEXTURE0。这就是为什么的默认值为0。

当调用glBindTexture时，glActiveTexture定义哪个texture unit被texture绑定。

> glActiveTexture(GL_TEXTURE0);

texture unit 个数由GPU提供,至少48。可以肯定地说,你将永远不会达到这个极限在即使是最极端的图形应用程序。

绑定多个纹理的情况,让我们尝试混合两张图片!我们先修改fragment shader去采样texture和混合像素:

> uniform sampler2D texKitten;
> uniform sampler2D texPuppy;

> void main()
{
    vec4 colKitten = texture(texKitten, Texcoord);
    vec4 colPuppy = texture(texPuppy, Texcoord);
    outColor = mix(colKitten, colPuppy, 0.5);
}

mix函数是一个特殊的GLSL函数线性插入两个变量之间基于第三个参数。值为0.0时将使用第一个值,值为1.0时将使用第二个值和两个值混合。

现在两个采样器都准备好了,先分配两个texture unit绑定两个texture。这是通过调用的glActiveTexture在texure加载的代码。

```c 
GLuint textures[2];
glGenTextures(2, textures);

int width, height;
unsigned char* image;

glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, textures[0]);
image = SOIL_load_image("sample.png", &width, &height, 0, SOIL_LOAD_RGB);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB,
              GL_UNSIGNED_BYTE, image);
SOIL_free_image_data(image);
glUniform1i(glGetUniformLocation(shaderProgram, "texKitten"), 0);

glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, textures[1]);
image = SOIL_load_image("sample2.png", &width, &height, 0, SOIL_LOAD_RGB);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB,
              GL_UNSIGNED_BYTE, image);
SOIL_free_image_data(image);
glUniform1i(glGetUniformLocation(shaderProgram, "texPuppy"), 1);

```

纹理采样已经介绍完毕,还有transformations和3D，暂时不讨论。


## 实例
//todo







