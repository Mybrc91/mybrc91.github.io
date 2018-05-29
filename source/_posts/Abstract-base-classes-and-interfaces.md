---
title: 抽象类和接口的差异
date: 2018-05-19 21:30:00
tags:
 - Java
categories:
 - Java
---

在Java编程中，抽象类和接口都是被经常使用的。那他们有什么区别呢？


>Often in a design, you want the base class to present only an interface for its derived classes. That is, you don’t want anyone to actually create an object of the base class, only to upcast to it so that its interface can be used. This is accomplished by making that class abstract using the abstract keyword. If anyone tries to make an object of an abstract class, the compiler prevents them. This is a tool to enforce a particular design.

通常在Java程序设计，你会创建一个基类，只暴露出一些接口给子类。基类不能被实例化，只会通过子类上转型到暴露出的接口。这就是`abstract`抽象类的使用场景。

>The interface keyword takes the concept of an abstract class one step further by preventing any function definitions at all. The interface is a very handy and commonly used tool, as it provides the perfect separation of interface and implementation. In addition, you can combine many interfaces together, if you wish. (You cannot inherit from more than one regular class or abstract class.)

而`interface`使抽象的概念更进一步，完成分离了接口的定义和实现，而且可以组合多个接口。

在`<Think in Java>`一书中有如上描述，我们大致可以看出接口和抽象类的区别。

更通俗的讲，抽象类定义了对象是什么和能做什么，接口只是定义了对象能做什么。

## 总结

### 相同点

1. 两者都是抽象的，都不能实例化。
2. `interface`和`abstract`的实现类都必须实现已经声明的抽象方法。

### 不同点

1. 类可以实现多个`interface`，只能继承一个`abstract`类。
2. `interface`是功能的抽象，`abstract`强调对象的本质。
3. `interface`所有方法都是抽象，`abstract`有抽象方法，也有非抽象方法，非抽象方法必须实现。
4. `interface`中基本数据类型为static，而抽象类不是的。

### 应用场景

1. 抽象类：把公共的方法提取到抽象类中，把需要子类各自实现的方法定义为抽象方法，很好的实现了代码复用和面向抽象编程。
2. 接口：只关注实现什么方法，不关注方法内容，这样就把接口和实现分离开来，这就是多态。

抽象类的功能要远超过接口，但是，定义抽象类的代价高。因为Java中每个类只能继承一个类。在这个类中，你必须继承或编写出其所有子类的所有共性。虽然接口在功能上会弱化许多，但是它只是针对一个动作的描述。而且你可以在一个类中同时实现多个接口。在设计阶段会降低难度的。

