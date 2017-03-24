---
title: Sublime中编译运行Java无法输出中文
date: 2017-03-24 21:52:04
tags:
 - Java
 - Tools
categories:
 - Tools
---

Windows系统下Sublime中通过自带的build系统运行Java文件无法输出中文的日志信息。

在[Sublime文档](http://docs.sublimetext.info/en/latest/reference/build_systems/exec.html)中看到如下语句：
> `encoding`
Optional.

Output encoding of `cmd`.Must be a valid Python encoding.Defaults to `UTF-8`.



可以看到，Sublime中执行cmd命令时，默认的Output输出编码是`UTF-8`的。

Java中的`Java`和`Javac`命令的信息输出默认情况下是通过`stderr`输出的（也可以使用`stdout`到文件）。

通过执行以下方法，可以查看Java环境下的`stderr`输出信息的编码格式：

```java

import java.util.*;

public class Propertie {

   public static void main(String[] a) {

      Properties sysProps = System.getProperties();

      sysProps.list(System.out);

   }

}

```

输出信息如下，`sun.stderr.encoding=ms936`

>java.runtime.name=Java(TM) SE Runtime Environment

sun.boot.library.path=C:\Program Files\Java\jre1.8.0_77\bin

java.vm.version=25.77-b03

java.vm.vendor=Oracle Corporation

java.vendor.url=http://java.oracle.com/

path.separator=;

java.vm.name=Java HotSpot(TM) 64-Bit Server VM

file.encoding.pkg=sun.io

user.script=

user.country=CN

sun.java.launcher=SUN_STANDARD

sun.os.patch.level=

java.vm.specification.name=Java Virtual Machine Specification

user.dir=G:\job\javatest

java.runtime.version=1.8.0_77-b03

java.awt.graphicsenv=sun.awt.Win32GraphicsEnvironment

java.endorsed.dirs=C:\Program Files\Java\jre1.8.0_77\lib...

os.arch=amd64

java.io.tmpdir=C:\Users\cheng\AppData\Local\Temp\

line.separator=

java.vm.specification.vendor=Oracle Corporation

user.variant=

os.name=Windows 10

sun.jnu.encoding=GBK

java.library.path=C:\PROGRAMDATA\ORACLE\JAVA\JAVAPATH;C...

java.specification.name=Java Platform API Specification

java.class.version=52.0

sun.management.compiler=HotSpot 64-Bit Tiered Compilers

os.version=10.0

user.home=C:\Users\cheng

user.timezone=

java.awt.printerjob=sun.awt.windows.WPrinterJob

file.encoding=GBK

java.specification.version=1.8

user.name=cheng

java.class.path=.

java.vm.specification.version=1.8

sun.arch.data.model=64

java.home=C:\Program Files\Java\jre1.8.0_77

sun.java.command=Propertie

java.specification.vendor=Oracle Corporation

user.language=zh

awt.toolkit=sun.awt.windows.WToolkit

java.vm.info=mixed mode

java.version=1.8.0_77

java.ext.dirs=C:\Program Files\Java\jre1.8.0_77\lib...

sun.boot.class.path=C:\Program Files\Java\jre1.8.0_77\lib...

sun.stderr.encoding=ms936

java.vendor=Oracle Corporation

file.separator=\

java.vendor.url.bug=http://bugreport.sun.com/bugreport/

sun.cpu.endian=little

sun.io.unicode.encoding=UnicodeLittle

sun.stdout.encoding=ms936

sun.desktop=windows

sun.cpu.isalist=amd64



所以导致输出中文信息无法查看，解决方法如下

在JavaC.sublime-build文件中加上`"encoding":"ms936"。