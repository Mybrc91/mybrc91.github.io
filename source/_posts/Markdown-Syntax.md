---
title: markdown syntax
date: 2017-03-06 16:46:04
tags:
 - markdown
 - syntax
categories:
 - markdown
---

-----

### 标题

"#"+空格 在标题前（可以多个） 

#一级标题
##二级标题

### 列表
#### 无序列表

-或者* +空格

- 第一
- 第五
* 第八

#### 有序列表

数字+“.”+空格 

1. 第一
2. 第二
3. 第三

### 引用

">"段落引用，可以多个“>>”,嵌套引用

>开头 引用
>>功到自然成

### URL

！+（url地址）  插入图片
![图片](https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png)

（url地址）[ 链接名称 ] 插入链接
[Google](https://www.google.com)

### 字体

两个\*\*引用  粗体
**粗体**

两个\*引用 斜体
*斜体*

两个\~\~引用 删除线
~~删除~~

两个反引号（键盘1的左边）引用  用作行内标记或者代码块 
这是个`fuck`的时代

"\"转义特殊字符
\*粗体*

### 分割线
3个以上*或者-单独一行 分割线
*****

### 表格
\|  表头 | 表头 | 表头|
\| :-------: |:-------|------:|
\| 居中 | 居左 | 居右|
\| 内撒容 | 居飒飒左 | 居阿萨右|

|  表头 | 表头 | 表头|
| :-------: |:-------|------:|
| 居中 | 居左 | 居右|
| 内撒容 | 居飒飒左 | 居阿萨右|

### 目录

`[toc]` 生成目录 标题的目录

使用3个" ` "+“语言名称” + 3个“ ` ”  加强代码块

```java
final public FragmentManager getChildFragmentManager() {
    if (mChildFragmentManager == null) {
        instantiateChildFragmentManager();
        if (mState >= RESUMED) {
            mChildFragmentManager.dispatchResume();
        } else if (mState >= STARTED) {
            mChildFragmentManager.dispatchStart();
        } else if (mState >= ACTIVITY_CREATED) {
            mChildFragmentManager.dispatchActivityCreated();
        } else if (mState >= CREATED) {
            mChildFragmentManager.dispatchCreate();
        }
    }
    return mChildFragmentManager;
}
```
### 流程图

>\`\`\`flow
st=>start: Start
e=>end
op=>operation: My Operation
cond=>condition: Yes or No?
st->op->cond
cond(yes)->e
cond(no)->op
\`\`\`

```flow
st=>start: Start
e=>end
op=>operation: My Operation
cond=>condition: Yes or No?
st->op->cond
cond(yes)->e
cond(no)->op
```

### 时序图

>\`\`\`sequence
       Alice->Bob: Hello Bob,How are you?
        Note right of Bob: Bob thanks
        Bob-->Alice: I am good thanks!
\`\`\`

```sequence
Alice->Bob: Hello Bob,How are you?
Note right of Bob: Bob thanks
Bob-->Alice: I am good thanks!
```

### LaTex公式
两个\$引用 表示行内公式
方程 $E=mc^2$

两个\$\$引用 表示整行公式
$$\sum_{i=1}^n a_i=0$$
$$f(x)=x^{x^x}$$



