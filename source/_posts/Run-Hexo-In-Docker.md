---
title: 在Docker中搭建hexo博客环境
date: 2017-04-24 22:09:03
tags:
 - hexo
 - docker
categories:
 - Web
---
在Docker环境已经搭建好的前提下，制作一个运行hexo博客的docker镜像

## 创建Dockerfile

1. 获取基础镜像
`FROM armhf/debian:jessie-backports`首先获取一个debian镜像，由于在树莓派上运行所以用`armhf/debian`，tag随意。
2. 系统更新和安装必要工具
```bash
RUN apt-get update
RUN apt-get -qy install curl xz-utils git
```
`apt-get -qy` 中qy参数会在需要确认的时候自动输入`y`
3. 下载安装node
```bash
WORKDIR /root/
RUN curl -O \
  https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-armv7l.tar.xz
RUN tar xvfJ node-*.tar.xz -C /usr/local \
  --strip-components=1
```
**WORKDIR**命令会切换工作目录，相当于**cd**，**curl**命令的**-O**参数会把当前地址的接收到的内容当作文件保存，`tar`命令的`-C`参数指定解压缩目录，`--strip-components`参数指定解压缩后的文件路径去掉最外层的几个目录，此处为1，即去掉最外层的根目录。
4. 安装hexo-cli
`RUN npm install hexo-cli -g` 方便使用`hexo`命令
5. 设置git库
首先clone git库
```bash
RUN git clone https://your-github-api-token:x-oauth-basic@github.com/Mybrc91/mybrc91.github.io.git
```
`your-github-api-token`替换成自己github创建的token，通过此方法使用github库，不需要创建sshkey
```bash
WORKDIR /root/mybrc91.github.io/
RUN npm install
RUN git config --global user.name "docker" && \
 git config --global user.email your-email
```
然后切换到git库目录，`RUN npm install`初始化node包，配置git config
```bash
RUN sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules && \
 git submodule update --init --recursive
```
由于包含着theme gitmodules，需要初始化submodule
`RUN sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules`替换submodule中的ssh url为https url方式获取git库
`RUN git checkout .gitmodules` 替换后再还原gitmodules文件
6. 更新git库，并启动hexo server
`CMD git pull & hexo clean & hexo g & hexo s`

## 创建docker镜像

`docker build -t hexo:3.3.1 -f hexoBlogDockerfile .`
`-t`指定镜像的名称和tag，`-f`指定Dockerfile文件，`.`点代表当前路径的Dockerfile文件。

经过一段时间，docker会运行所有`RUN`和`FROM`命令,并保存结果到镜像中，当显示`Successfully built xxxx`，镜像就创建成功，镜像id为xxxx。

运行`docker images`查看创建的镜像。

## 运行container
### 创建container
`docker run -d -p 5000:4000 --name hexoblog hexo:3.3.1`
通过创建的docker镜像运行一个container，`-d`参数代表运行在后台守护进程，`-p 5000:4000`表示本地主机和container的端口映射。
run默认会运行Dockerfile文件中的`CMD`命令，所以hexo server会启动，并绑定默认4000端口，通过访问localhost:5000 就能访问到container中的hexo server。

### 管理container

- `docker stats`查看container状态，包括cpu，memory等
- `docker container ls`查看当前运行的container信息，包括镜像名称，container名称，CMD命令，创建时间，端口映射
- `docker exec -ti container-name-or-id /bin/sh` 进入container模拟终端环境

运行`docker container --help`查看一系列的container管理命令


