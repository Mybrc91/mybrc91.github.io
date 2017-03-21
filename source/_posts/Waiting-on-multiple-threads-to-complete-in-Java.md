---
title: Waiting on multiple threads to complete in Java
date: 2017-03-22 21:46:04
tags:
 - Java
 - Thread
categories:
 - Java
---

Java语言中，实现等待多个线程执行完的几种方式

1. `Thread.join()` API has been introduced in early versions of Java. Some good alternatives are available with this concurrent package since the JDK 1.5 release.
2. [ExecutorService#invokeAll()](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html#invokeAll-java.util.Collection-)
> Executes the given tasks, returning a list of Futures holding their status and results when everything is completed.
Refer to this related SE question for code example:
[How to use invokeAll() to let all thread pool do their task?](http://stackoverflow.com/questions/18202388/how-to-use-invokeall-to-let-all-thread-pool-do-their-task/39547616#39547616)
3. [CountDownLatch](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html)
> A synchronization aid that allows one or more threads to wait until a set of operations being performed in other threads completes.
A **CountDownLatch** is initialized with a given count. The await methods block until the current count reaches zero due to invocations of the `countDown()` method, after which all waiting threads are released and any subsequent invocations of await return immediately. This is a one-shot phenomenon -- the count cannot be reset. If you need a version that resets the count, consider using a **CyclicBarrier**.
Refer to this question for usage of `CountDownLatch`
[How to wait for a thread that spawns it's own thread?](http://stackoverflow.com/questions/35075886/how-to-wait-for-a-thread-that-spawns-its-own-thread/35076391#35076391)
4. [ForkJoinPool](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html) or [newWorkStealingPool()](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html#newWorkStealingPool--) in [Executors](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html)
5. Iterate through all [Future](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Future.html) objects created after submitting to `ExecutorService`
6. If you want to **shutdown** executor service, you have to execute `shutdown`,`awaitTermination`,`shutdownNow` in a sequence.

Refer to below documentation link for more details:
[wait-for-completion-of-all-tasks-in-executorservice](http://stackoverflow.com/documentation/java/143/executors/20176/wait-for-completion-of-all-tasks-in-executorservice#t=201610261028007430665)

参考：[stackoverflow](http://stackoverflow.com/a/36797569/2873726)
