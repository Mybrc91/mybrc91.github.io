---
title: 自动化部署VuePress到GithubPages
lang: zh-cn
date: 2018-05-02 20:03:05
meta:
  - name: description
    content: deploy vuepress blog on travisci
  - name: keywords
    content: travis ci vuepress
tag: Vue
category: Web

---
# 通过TravisCI自动化部署VuePress到GithubPages
这篇文章主要介绍部署[vuepress](https://vuepress.vuejs.org)到[travis-ci](https://travis-ci.com)上，方便自动化发布文章。

>VuePress is composed of two parts: a minimalistic static site generator with a Vue-powered theming system, and a default theme optimized for writing technical documentation. It was created to support the documentation needs of Vue's own sub projects.

[vuepress](https://vuepress.vuejs.org)是一个由[vuejs](https://vuejs.org/)驱动的静态网站生成系统。默认带有一个为编写技术文档优化的主题。所以我们可以用它来代替类似Hexo等静态网站系统，并且能通过vue带来更多有用的特性，具体内容请去[vuepress](https://vuepress.vuejs.org)官网查看。

## 安装VuePress
>注意
VuePress需要Node.js 版本>=8。


### 全局安装
```bash
# 全局安装
yarn global add vuepress # OR npm install -g vuepress

# 创建md文件
echo '# Hello VuePress' > README.md

# 启动服务器
vuepress dev

# 编译成静态文件
vuepress build
```
### 本地安装

如果用于项目文档，需要把VuePress安装到本地项目目录。由于本文目的是用于静态博客，所以从建目录开始。
```bash
#创建项目目录
mkdir vue-press-blog

cd vue-press-blog

#安装vuepress
yarn add -D vuepress # or npm install -D vuepress

#创建sources目录
mkdir sources

echo '# Hello VuePress'> sources/README.md
```

>警告
如果在已经存在的项目中使用了webpack 3.x依赖，推荐使用[yarn](https://yarnpkg.com/)
安装依赖，npm安装的话依赖树无法正确生成。


然后添加下面的内容到`package.json`文件中：
```json{3,4}
{
  "scripts": {
    "blog:dev": "vuepress dev sources",
    "blog:build": "vuepress build sources"
  }
}
```

第3、4行的`blog:dev`是可以自定义的，`sources`代表md文件的目录，也可以自定义，只要有对应的目录就可以。

现在可以运行刚添加的命令，开始编写md文件，同时在浏览器中预览效果，VuePress会自动加载更改的文件。
```bash
yarn blog:dev # or npm run blog:dev
```

如果要生成静态页面，可以运行：
```bash
yarn blog:build # or npm run blog:build
```
静态页面默认在`sources/.vuepress/dist/`目录下,可以通过`.vuepress/config.js`文件base字段自定义配置。生成的静态文件可以放到任意server上。

## 配置

新建配置文件`config.js`在`.vuepress/`目录下，更多配置信息参考[vuepress官网](https://vuepress.vuejs.org/guide/basic-config.html)

## 资源文件

新建资源文件目录`.vuepress/public`，这个目录下的文件在`vuepress build`时会复制到`dist`根目录下。

### Base URL

本文要把vuepress部署到github page上，需要定义`base`变量，为了正确引用资源文件。不在github page上部署的话，不需要理会。

如果部署在`https://{your-github-name}.github.io`地址上,不需要配置。要是类似`https://{your-github-name}.github.io/{repo-name}/`地址上，需要在`config.js`中定义`base`的值为`/{repo-name}/`。

```js{3}
//config.js
module.exports = {
    base:'/vue-press-blog/',
    title:'Mybrc91\'s Site',
    description:'Just A Tech Site.'
}
```

## 在Github Page上部署

### 初始化github仓库

#### 创建仓库

1. 如果要部署到`https://{your-github-name}.github.io`地址上，需要创建以`{your-github-name}.github.io`为名字的仓库
2. 如果部署到`https://{your-github-name}.github.io/{repo-name}/`地址上，要创建`{repo-name}`仓库。

本文是第二种，创建了`vue-press-blog`仓库。

#### 部署源码

在根目录下创建忽略文件`.gitginore`，填入如下内容。第6行可以根据情况修改，不需要把生成的静态文件提交到github上：
```{6}
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
sources/.vuepress/dist/
*.bat
*.sh
```

在根目录创建`deploy.sh`，填入以下内容:
```bash
#!/usr/bin/env sh

# 发生错误时停止
set -e

git init
git add -A
git commit -m 'init'

git config --local user.name "{name}"
git config --local user.email {email}

# 如果部署到 https://{USERNAME}.github.io
# git push -f git@github.com:{USERNAME}/{USERNAME}.github.io.git master:{branch-name}

# 如果部署到 https://{USERNAME}.github.io/{REPO}
#git push -f git@github.com:{USERNAME}/{REPO}.git master

cd -
```

运行命令`. deploy.sh`,把源码提交到github上。

### 配置TracisCI

#### 创建配置文件

在项目根目录下创建travis-ci的配置文件`.travis.yml`，travis-ci根据这个文件自动编译部署。

配置如下，注意第3行，需要使用lts版本的nodejs：
```yaml{3}
language: node_js
node_js:
  - "lts/*"
branches:
  only:
  - master

cache:
  directories:
  - node_modules
  yarn: true

before_install:
- export TZ='Asia/Shanghai'  # 设置时区

install:
- yarn

script:
- yarn blog:build

deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN
  local-dir: ./sources/.vuepress/dist/ ## 根据情况自定义到静态文件输出目录
  target-branch: gh-pages
  verbose: true
  on:
    branch: master

```

#### 设置travis-ci.org

1. 首先获取从github网站获取GITHUB_TOKEN。登录github，打开[token](https://github.com/settings/tokens),点击`Generate new token`,根据提示创建token，选项一般都取默认值，最后获取到一个字符串token。

2. 假设已经会使用travis-ci，然后登录[travis-ci.org](https://travis-ci.org/)，添加新建的仓库。打开仓库的`setting`项,在`Environment Variables`条目下添加`GITHUB_TOKEN`变量，变量值就是上一步获取到的token。

#### 提交代码到github

在根目录输入以下命令：
```bash{3}
git init
git add -A
git commit -m '{comment}'
git push -u {git地址} master
```
第3行的`{comment}`替换成实际的提交评论，`{git 地址}`替换前面创建仓库的地址。

travis-ci检测到项目的提交，就会根据`.travis.yml`文件去编译项目，最后把生成的静态文件推送到仓库的`gh-pages`分支，然后访问对应的目录就能看到生成的静态网站。本文生成的地址是[mybrc91.github.io/vue-press-blog](http://mybrc91.github.io/vue-press-blog)。

以后有新的改动，只需要执行最后一步提交代码的命令，travis-ci就会自动编译部署。