---
title: Raspberrypi下挂载NTFS格式硬盘
date: 2018-04-12 23:31:04
tags:
 - Linux
categories:
 - Linux
---

`最近在折腾树莓派，顺便把移动硬盘挂载到树莓派上，当下载磁盘。然而树莓派不能自动挂载NFTS格式的磁盘，所以需要手动配置一下。`
#### 安装ntfs-3g
`ntfs-3g`是Linux系统下用来支持读写NTFS格式硬盘的软件包。
输入命令`sudo apt-get install ntfs-3g`，完成安装。喜欢源码编译的也可以去[官网](https://www.tuxera.com/community/open-source-ntfs-3g/)下载源码自行编译。
#### 接入硬盘，使用`fdisk -l` 查看磁盘信息
[![fdisk-l.png](https://i.loli.net/2018/04/12/5acf7844e2b9d.png)](https://i.loli.net/2018/04/12/5acf7844e2b9d.png)

可以看到`/dev/sda`就是要挂载的硬盘。`/dev/sda1(2,5,6,7)`就是硬盘的分区，我要挂载的是Type类型为`HPFS/NTFS/exFAT`的1、5、6、7分区。由于这个硬盘已经在Windows下事先分区了，所以省略了分区的步骤。如要需要，请自行分区。

#### 挂载硬盘到指定的挂载点上
##### 使用ntfs-3g挂载

这种挂载方式只在当前生效，重启后就会消失，适用于只是暂时使用一下硬盘。

使用方式很简单，输入命令`ntfs-3g /dev/sda1 /mnt/windows`就把`/dev/sda1`分区挂载到了`/mnt/windows`目录下面，默认有读写权限。如需设置权限，请自行查看帮助文档。

##### 编辑`/etc/fstab`文件，实现开机自动挂载

在文件末尾追加如下行`/dev/sda1 /mnt/windows ntfs utf8,uid=1000,gid=1000,umask=755 0 0`

#### 卸载磁盘
输入命令`umount /mnt/windows`
#### 查看磁盘信息
输入命令`df -h`就可以看到所有磁盘的挂载信息

