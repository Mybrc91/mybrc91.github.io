---
title: 在树莓派上安装docker环境
date: 2017-04-22 21:09:03
tags:
 - Raspberrypi
 - docker
categories:
 - Linux
---
在树莓派上安装docker环境

记录一下在树莓派上搭建docker环境的过程。为简单起见,我们将使用默认的操作系统称为Raspbian。此方法适用于大多数类型的树莓派,model B 2、3和Zero。

不知道docker为何物的，请先移步[docker 官网](https://docs.docker.com/engine/docker-overview/)。

给树莓派安装Raspbian 系统的过程也不介绍了，请移步[树莓派官网](https://www.raspberrypi.org/downloads/raspbian/)。

## Install Docker

### Connect with SSH

```bash
$ ssh pi@raspberrypi
```
输入pi账户的密码，默认是raspberry，为了安全原因最好修改默认密码，通过`passwd`命令。


### Start the Docker installer
Docker项目有一个自动安装脚本，可以一个命令下载安装docker环境。

```bash
$ curl -sSL get.docker.com | sh
```

等待安装完成，如果想使用测试版本的docker，可以把`get.docker.com`替换成`test.docker.com`。


## Configure Docker

有一些手动配置为了更好使用docker。

### Set Docker to auto-start

```base
$ sudo systemctl enable docker
```

然后重启树莓派，开启docker服务。

```bash
$ sudo systemctl start docker
```

### Enable Docker client
默认的docker client只能通过root用户和docker组的用户使用，所以把pi用户添加到docker组以正常使用。

```bash
$ sudo usermod -aG docker pi
```

退出登录，重连ssh，使配置生效。

## Using Docker
由于目前docker对ARM处理器的树莓派支持工作还在进行中，所以有一些问题要注意：

### Pulling images from the Hub
如果你从`Docker hub`获取`busybox`镜像的话是会报错的。因为没有为ARM架构专门设计的镜像，只是对x86_64架构的设备。Docker项目也一直在做ARM架构的支持工作。

我们只能尝试使用我们知道的支持ARM的镜像。目前没有严格的官方镜像但是Docker团队维护着大量前缀为armhf的实验镜像。

armhf就是指支持树莓派的镜像，hf = hard float。

## Running your first ARM image
先尝试一下官方的`Alpine Linux image`镜像`armhf/alpine`。`Alpine Linux`是一个只有1.8m的系统。
```bash
$ docker run -ti armhf/alpine /bin/sh

/ # cat /etc/os-release
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.5.2
PRETTY_NAME="Alpine Linux v3.5"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

/ # exit
```
`/bin/sh`就是启动了一个BusyBox shell，下面是直接运行二进制程序的例子

```bash
$ docker run armhf/alpine date
Sat Apr 22 14:12:59 UTC 2017
```

## Build a new image
创建一个镜像在Docker镜像的基础上，用`resin/rpi-raspbian`作为基础，然后在里面添加`curl`和`ca-certificates`。首先新建一个`Dockerfile`文件，通过这个文件来build镜像。更多信息查看[Docker Build Image](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)。
在`Dockerfile`文件中输入以下内容：

```bash
FROM resin/rpi-raspbian:latest

RUN apt-get update && \
    apt-get -qy install curl ca-certificates

CMD ["date"]
```
解释一下文件中的内容：

- `FROM` 获取构建的基础镜像
- `RUN` 获取到镜像后运行的命令
- `CMD` docker容器启动后运行的第一个命令，也就是`docker run cmd`。

然后构建镜像，输入以下命令：

```bash
$ docker build -t curl_docker .
$ docker run curl_docker
```

这个构建的docker镜像就保存在了本地，使用`docker images`命令查看镜像列表，删除使用`docker rmi curl_docker`,删除垃圾镜像使用`docker rmi --force $(docker images -f "dangling=true" -q)`。

### The same with Alpine Linux

Alpine Linux 不使用`apt-get`包管理器，使用`apk`工具, 定义`Dockerfile`如下：
```bash
FROM armhf/alpine

RUN apk add --no-cache curl ca-certificates

CMD ["curl", "https://docker.com"]
```
运行命令：
```bash
$ docker build -t curl_docker_alpine .

$ docker run curl_docker_alpine
```
## Create a Node.js application
创建一个安装Nodejs的镜像，Dockerfile如下保存在nodeDockerfile中：
```bash
FROM resin/rpi-raspbian:latest
ENTRYPOINT []

RUN apt-get update && \
    apt-get -qy install curl \
                build-essential python \
                ca-certificates
WORKDIR /root/
RUN curl -O \
  https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-armv7l.tar.xz
RUN tar -xvf node-*.tar.gz -C /usr/local \
  --strip-components=1

CMD ["node"]
```
运行构建命令：
```bash
$ docker build -t node:arm -f nodeDockerfile .
$ docker run -ti node:arm
```

参考：
[blog.alexellis.io](http://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/)
[www.projectatomic.io](http://www.projectatomic.io/blog/2015/07/what-are-docker-none-none-images/)