---
title: 在树莓派上部署git服务gogs
lang: zh-cn
date: 2018-05-06 23:30:05
meta:
  - name: description
    content: deploy gogs on raspberrypi
  - name: keywords
    content: gogs git raspberrypi

---
# 在树莓派上部署git服务gogs

[Gogs](https://gogs.io/)是一款极易搭建的自助git服务。相对于Gitlab等git服务，gogs有易安装、跨平台、轻量级的特性。gogs在树莓派上也能很流畅的运行，对于小型开发团队极其适用。

本文主要介绍gogs在树莓派上的搭建过程。

>注意
git 服务版本>1.7.1
本文使用sqlite3作为数据库，不需要安装
安装nginx（不需要反向代理可以不装）


## 安装go语言环境

这里选择源码方式安装。

首先需要安装编译go的编译器。

### 安装go编译器

首先下载[go1.4-bootstrap](https://dl.google.com/go/go1.4-bootstrap-20171003.tar.gz)，放到用户根目录下解压缩。

然后需要设备go编译器的环境变量，默认情况下路径是根目录下的`go1.4`目录，所以只需要修改解压缩后的文件见名称为`go1.4`即可。如果需要放到其他目录，记得设置`GOROOT_BOOTSTRAP`环境变量到编译器目录。

### 安装go语言

下载[go1.10.2.src](https://dl.google.com/go/go1.10.2.src.tar.gz)源码并解压缩到用户根目录。

运行以下命令，等待编译完成。

```bash
$ cd go/src
$ ./all.bash
```

编译完成后，需要设置go的执行路径到环境变量，也就是把`go/bin`路径添加到环境变量中。

示例如下，添加以下内容到用户根目录的`.bashrc`文件中。
```bash
export GOROOT=$HOME/go
export PATH=$PATH:$GOROOT/bin
```

运行`source .bashrc`命令使环境变量生效。

测试一下。

创建`hello.go`文件，填入以下内容
```go
package main

import "fmt"

func main() {
    fmt.Printf("hello, world\n")
}
```

运行`go run hello.go`命令，看到`hello， world`的话就算安装完成了。

## 安装gogs

gogs我们采用二进制安装的方式，官网提供了支持树莓派的安装包。

首先下载[gogs安装包](https://dl.gogs.io/0.11.43/gogs_0.11.43_raspi2_armv6.zip)并解压缩到用户根目录。
然后就安装完成了。

## 运行gogs

运行以下命令

```bash
$ cd gogs
$ ./gogs web
```
gogs就运行起来了，直接在浏览器访问树莓派地址加3000端口号，就可以看到gogs的初始化界面。

## 配置gogs

gogs自带默认的配置，用户自定义配置是gogs目录下的`custom/conf/app.ini`文件。

我们需要配置有`ROOT`、`RUN_USER`、`DB_TYPE`、`DOMAIN`、`ROOT_URL`、`START_SSH_SERVER`、`SSH_LISTEN_HOST`、`SSH_LISTEN_PORT`。

`ROOT`代表git仓库的根路径。

`RUN_USER`表示当前运行gogs的用户名，由于raspberry默认用户是`pi`,为了不增加复杂度，我们设置为`pi`。

`DB_TYPE`表示数据库类型，此处设置成`sqlite3`。

`DOMAIN`代表访问gogs的域名，如果只在内网访问，可以设置成树莓派的主机名`raspberrypi`，在外网访问的话就需要设置成域名，我的域名是`git.gdzrch.win`。

`ROOT_URL`代表gogs的web界面访问地址，需要完整的url，例如`http://git.gdzrch.win`。

`START_SSH_SERVER`表示开始gogs内置的ssh服务，不使用树莓派的ssh服务，为了更方便的处理，此处我们使用内置的ssh服务。

`SSH_LISTEN_PORT`表示内置ssh服务的监听端口，由于树莓派的ssh服务默认占用22端口，所以我们需要监听别的端口，比如`2022`。当然你也可以修改树莓派ssh服务的默认端口，让gogs内置的ssh服务使用22端口。此处我们使用`2022`端口。

`SSH_LISTEN_HOST`是内置ssh服务的监听地址，设置为`0.0.0.0`表示所有的地址都可以访问。

示例配置如下

```ini
RUN_USER = pi

[database]
DB_TYPE  = sqlite3

[repository]
ROOT = /home/pi/gogs-repositories

[server]
DOMAIN           = git.gdzrch.win
ROOT_URL         = http://git.gdzrch.win/
START_SSH_SERVER = true
SSH_LISTEN_HOST  = 0.0.0.0
SSH_LISTEN_PORT  = 2022

```

保存配置，重新运行`./gogs web`。这时，我们的gogs服务就运行在了`http://git.gdzrch.win/`域名下，ssh服务就运行在了`git.gdzrch.win`的`2022`端口。在使用git服务配置ssh的时候要注意端口的配置，不是默认的`22`端口。

## Nginx反向代理

为了更好的性能，我们配置一下nginx反向代理。

在`/etc/nginx/sites-available/目录下创建gogs文件，填入以下内容。

```bash
server {
        listen 80;
        server_name git.gdzrch.win;
        location / {
                proxy_pass http://127.0.0.1:3000;
        }
}
```

`listen`是公网上暴露的端口，`server_name`是我们给gogs配置的域名，`proxy_pass`就是gogs运行的地址和端口。如果要通过域名子路径访问，可以修改`location`后的路径，比如`location /gogs/`，
然后就可以通过`git.gdzrch.win/gogs`访问了。

## 守护进程服务

如过要以守护进程的方式运行gogs，可以配置`Systemd`服务。

在`/etc/systemd/system/`目录下创建`gogs.service`文件，填入以下内容。

```bash
[Unit]
Description=Gogs
After=syslog.target
After=network.target

[Service]
Type=simple
User=pi
Group=pi
WorkingDirectory=/home/pi/gogs
ExecStart=/home/pi/gogs/gogs web
Restart=always
Environment=USER=pi HOME=/home/pi

[Install]
WantedBy=multi-user.target

```

通过`sudo systemctl enable gogs`激活，执行`sudo systemctl start gogs`启动gogs服务。

还可以运行`sudo systemctl status gogs -l`查看当前gogs的状态。


到此为止，基本完成了gogs服务在树莓派上的部署。更多的内容请查看[官方文档](https://gogs.io/docs/)。
