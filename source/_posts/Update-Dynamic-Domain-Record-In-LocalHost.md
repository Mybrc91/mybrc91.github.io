---
title: Update Dynamic Domain Record In LocalHost
date: 2017-04-17 22:17:04
tags:
 - Web
 - Linux
categories:
 - Web
---

记录一下给本地主机配置动态域名解析，实现外网访问的过程。

最近入手了一个树莓派，就把它用来当服务器用，顺便练手学习。正好配合我的的域名，实现外网访问服务器。

## 配置端口映射

因为我们平常设备的地址都是运营商分配给你一个动态ip，然后再用NAT转换。所以在路由器上设置端口映射，来访问你的设备。
路由器以我的openwrt为例，在网络->防火墙->端口转发中新建端口转发：

| 名字 | 协议 | 外部区域 | 外部端口 | 内部区域 | 内部IP地址 | 内部端口 |
|:----:|:----:|:--------:|:--------:|:--------:|:----------:|:--------:|
| pi   | tcp  | wan      | 80       | lan      | 192.168.1.x| 8080     |

各项见名知意，不再描述。

## 配置域名解析
我的域名是阿里云的，就以阿里云为例，其他的服务商也类似，只要提供修改域名记录的API就能通过api定时修改域名解析记录。
### 添加域名解析记录
首先在阿里云的云dns控制台添加域名的解析记录，各种类型的域名解析记录不再描述，以我的为例，我添加一个子域名解析记录：
`A记录->site.gdzrch.win->当前公网ip`

### 利用API动态修改域名记录
由于运营商分配的公网ip是会变化的，所以需要动态修改域名解析记录。
#### 新建`access token`
在阿里云控制台新建`access token`，通过token才能调用api。
#### 安装API命令行工具
`sudo pip install aliyuncli`
详细步骤参考：[在线安装阿里云命令行工具](https://help.aliyun.com/document_detail/29995.html?spm=5176.doc29996.6.546.dU0TMm)
#### 安装阿里云dns api
`sudo pip install aliyun-python-sdk-alidns`
#### 配置API命令行
```bash
$ sudo aliyuncli configure
Aliyun Access Key ID [************jkf]: <Enter>
Aliyun Access Key Secret [***************Okl]: <Enter>
Default Region Id [cn-qingdao]: cn-hangzhou
Default output format [json]: <Enter>
```
参考[配置命令行](https://help.aliyun.com/document_detail/43039.html?spm=5176.doc30003.6.550.lGy5m1)
#### 编写动态修改域名记录脚本
```bash
#!/bin/bash
date=`date "+%Y-%m-%d %H:%M:%S"`
oldIp=`sudo aliyuncli alidns DescribeDomainRecordInfo --DomainName gdzrch.win --RecordId 3331648077174784 --filter Value`
oldIp=${oldIp#\"}
oldIp=${oldIp%\"}
ipjson=`curl http://ip.chinaz.com/getip.aspx`
newIp=${ipjson#*ip:\'}
newIp=${newIp%\',address*}
echo $newIp
echo $oldIp
if [ $newIp = $oldIp ];then
    echo "date:$date no update ip $newIp" >> domainUpdateLogs
else
    echo "date:$date update new ip $newIp ; old ip $oldIp" >> domainUpdateLogs
    sudo aliyuncli alidns UpdateDomainRecord --RecordId 3331648077174784 --Value "$newIp"
fi
```
1. `sudo aliyuncli alidns DescribeDomainRecordInfo --DomainName gdzrch.win --RecordId 3331648077174784 --filter Value`
首先利用命令行工具获取域名记录的当前ip，`RecordId`通过`sudo aliyuncli alidns DescribeDomainRecords --DomainName gdzrch.win`查看
2. `curl http://ip.chinaz.com/getip.aspx`
通过在线接口获取当前设备的公网ip
3. 比较新旧ip是否相等，不等则更新域名记录
`sudo aliyuncli alidns UpdateDomainRecord --RecordId 3331648077174784 --Value "$newIp"`
4. echo 重定向记录日志信息

把脚本上传到服务器任意目录，赋予执行权限`chmod 755 脚本`

#### 通过crontab建立定时任务
运行`crontab -e`新建定时任务
`0 3 * * * bash ~/updateDomainRecord.sh` 每天三点运行脚本，更新域名记录，具体用法在编辑文件时能看到。

## 总结
很简单的几步，就完成了给本地服务器配置动态域名解析记录的功能。但是其中涉及到了很多知识，可以深入学习。由点到面，完善知识体系：
1. python pip
2. bash语法
3. crontab 定时任务
4. 端口映射