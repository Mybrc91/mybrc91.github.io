---
title: Big and Little Endian
date: 2017-03-31 19:07:04
tags:
 - Data
categories:
 - Programme
---

介绍一下大小端字节顺序。

翻译自[www.cs.umd.edu](https://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Data/endian.html)

## Basic Memory Concepts

在了解大小端之前,先来了解一下Memory。这里只是介绍Memory的抽象概念，不需要了解Memory的工作细节。

我们一般认为Memory是一个大的数组。但这个数组包含什么?包含字节。在计算机中,人们不使用`index`表示数组的位置。相反,使用`address`。`index`和`address`的意思是一样的。

每个地址存储内存“数组”的一个元素。每个元素通常是一个字节。有一些内存配置,每个地址存储并不是一个字节。例如,你可能存储半个字节或一bit。然而,这些都是极其罕见的,所以现在,我们假设,所有的内存地址都存储字节。

## Storing Words in Memory

我们暂定义一个字符为4个字节也就是32bit，一个内存地址能保存一个字节（8bit），那一个字符如何在内存中保存呢？其实很简单，就是把32bit分成4个bytes，例如一个32bit的字符 90AB12CD16` ，它是用16进制格式表示的。所以分成4bytes就是：`90, AB, 12, CD`。

然后把每个byte存进内存中，就有了以下两种保存方式：

### Big Endian

在大端模式中，高位byte被保存在低位地址中，如下图所示：

| Address | Value |
|:-------:|:-----:|
|  1000   |   90  |
|  1001   |   AB  |
|  1002   |   12  |
|  1003   |   CD  |

### Little Endian

在小端模式中，低位byte被保存在低位地址中，如下图所示：

| Address | Value |
|:-------:|:-----:|
|  1000   |   CD  |
|  1001   |   12  |
|  1002   |   AB  |
|  1003   |   90  |

## Which Way Makes Sense？

不同的处理器使用不同的字节顺序，ARM系统中一般是小端模式，MIPS处理器允许配置大小端。
所以要知道使用的字节顺序很重要，否则不能获取到正确的内存数据。

解决方案是使用网络字节顺序发送4字节。如果你的机器和网络字节顺序相同,不需要改变。如果不是,那么你必须翻转字节。

## History of Endian-ness

`endian`这个词从何而来?乔纳森·斯威夫特（Jonathan Swift）是一个讽刺作家。他最著名的书是“格列佛游记（Gulliver's Travels）”,他写到某些人喜欢吃煮熟鸡蛋从小的那头开始,而另一些人更喜欢从大的那头开始,这导致各种战争。

当然,重要的是说,这是一个愚蠢的争论,然而,人们争论这样的琐事(例如,vi或emacs吗?UNIX或Windows)。

##  Misconceptions （错误的概念）

字节顺序的意义仅在于当你存一个大的值通过分割成几个小的值。你必须决定它在内存中的顺序。然而,对于32位寄存器存储一个32位值,是没有意义的讨论字节顺序。

当你分割一个多字节值,并试图将字节存储在连续的内存中时字节序才有意义。在寄存器中,它没有意义。寄存器是32位。

## C-style strings

Once you start thinking about endianness, you begin to think it applies to everything. Before you see big or little endian, you may have had no idea it even existed. That's because it's reasonably well-hidden from you.
If you do bitwise/bitshift operations on an int, you don't notice the endianness. The machine arranges the multiple bytes so the least significant byte is still the least significant byte (e.g., b7-0) and the most significant byte is still the most significant byte (e.g., b31-24).

So, it's natural to think whether strings might be saved in some sort of strange order, depending on the machine.

This is where it's useful to think about all the facts you know about arrays. A C-style string, after all, is still an array of characters.

Here are some facts you should know about C-style strings and arrays.

C-style strings are stored in arrays of characters.
Each character requires one byte of memory, since characters are represented in ASCII (in the future, this could change, as Unicode becomes more popular).
In an array, the address of consecutive array elements increases. Thus, & arr[ i ] is less than & arr[ i + 1 ].
What's not as obvious is that if something is stored in increasing addresses in memory, it's going to be stored in increasing "addresses" in a file. When you write to a file, you usually specify an address in memory, and the number of bytes you wish to write to the file starting at that address.
So, let's imagine some C-style string in memory. You have the word "cat". Let's pretend 'c' is stored at address 1000. Then 'a' is stored at 1001. 't' is at 1002. The null character '\0' is at 1003.
Since C-style strings are arrays of characters, they follow the rules of characters. Unlike int or long, you can easily see the individual bytes of a C-style string, one byte at a time. You use array indexing to access the bytes (i.e., characters) of a string. You can't easily index the bytes of an int or long, without playing some pointer tricks (using reinterpret cast, for example, in C++). The individual bytes of an int are more or less hidden from you.

Now imagine writing out this string to a file using some sort of write() method. You specify a pointer to 'c', and the number of bytes you wish to print (in this case 4). The write() method proceeds byte by byte in the character string and writes it to the file, starting with 'c' and working to the null character.

Given that explanation, is it clear whether endianness matters with C-style strings? Hopefully, it is clear.

As an aside, since C++ strings are objects, it may have complicated inner structures, and so it's less obvious what a C++ string would look like when print out to a file. It's well-known what a C-style string looks like (a sequence of characters ending in a null character), which is why I've been careful to call them C-style strings.