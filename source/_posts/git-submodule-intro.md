---
title: Git子模块简介
date: 2018-04-13 23:10:04
tags:
 - Git
categories:
 - Linux
---


`最近研究Hexo搭建静态博客，遇到了Git子模块的问题，特此记录一下。`
 ### 子模块
 > 有种情况我们经常会遇到：某个工作中的项目需要包含并使用另一个项目。 也许是第三方库，或者你独立开发的，用于多个父项目的库。 现在问题来了：你想要把它们当做两个独立的项目，同时又想在一个项目中使用另一个。

 我们举一个例子。 假设你正在开发一个网站然后需要引入主题模块。你决定使用一个第三方库，你可能需要将源代码直接拷贝到自己的项目中。如果将这个库包含进来，那么无论用何种方式都很难定制它，部署则更加苦难。如果将代码复制到自己的项目中，那么你做的任何自定义修改都会使合并第三方库上游的改动变得困难。

 Git 通过子模块来解决这个问题。 子模块允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。
 
 ### 使用子模块
 
 下面通过主项目`parentrepo`和子项目`chindrenrepo`演示子模块的用法。
 
 首先初始化主项目`parentrepo`。然后通过`git submodule add`命令后面加上子模块`childrenrepo`的URL。
 [![submodule-add.png](https://i.loli.net/2018/04/13/5ad0ae258f704.png)](https://i.loli.net/2018/04/13/5ad0ae258f704.png)

默认情况下，submodule会将子模块项目放到与仓库同名的目录下，本例中是`childrenrepo`目录下。如果需要放到其他目录，可以在命令结尾添加一个路径。如下命令就把`chindrenrepo`项目放到了`parentrepo`项目的`theme/childrenrepo`目录下。
[![submodule-add-path.png](https://i.loli.net/2018/04/13/5ad0af5d6cff4.png)](https://i.loli.net/2018/04/13/5ad0af5d6cff4.png)

继续上面的例子，恢复到默认目录的情况。

这时运行`git status`,有几点要注意。
[![git-status.png](https://i.loli.net/2018/04/13/5ad0b0a670b8d.png)](https://i.loli.net/2018/04/13/5ad0b0a670b8d.png)

有一个新的文件`.gitmodules`生成。该文件保存着子模块项目URL和本地目录的映射关系。

```bash
$cat .gitmodules
[submodule "childrenrepo"]
        path = childrenrepo
        url =  git@github.com:Mybrc91/childrenrepo.git   
        
```

这个文件不能被`.gitignore`忽略，要受版本控制，提交到仓库中。这样的话子模块信息就包含在了主项目中，有人拉取项目也会获取到子模块的信息。

在`git status`的输出中，还有一个新的目录生成，就是子模块的目录。运行`git diff`,有如下信息。
```bash
$ git diff --cached childrenrepo
diff --git a/childrenrepo b/childrenrepo
new file mode 160000
index 0000000..86cc139
--- /dev/null
+++ b/childrenrepo
@@ -0,0 +1 @@
+Subproject commit 86cc13948af71df1fc60ea956d099add7bb5af19
```

虽然`childrenrepo`是主项目中的一个目录，但Git只会把它当成子模块，当你不在子模块的目录时，Git不会跟踪里面的内容更改，只是当作一个特殊提交`Subproject commit`。

当输入`git diff --cached --submodule`能看到更详细的submodule信息。
```bash
$ git diff --cached --submodule
diff --git a/.gitmodules b/.gitmodules
new file mode 100644
index 0000000..35b9e78
--- /dev/null
+++ b/.gitmodules
@@ -0,0 +1,3 @@
+[submodule "childrenrepo"]
+       path = childrenrepo
+       url = git@github.com:Mybrc91/childrenrepo.git
Submodule childrenrepo 0000000...86cc139 (new submodule)

```

然后提交，有如下信息：
```bash
$ git commit -m "add childrenrepo submodule"
[master 404bef2] add childrenrepo submodule
 2 files changed, 4 insertions(+)
 create mode 100644 .gitmodules
 create mode 160000 childrenrepo
```

注意到`childrenrepo`的模式是`160000`,这是Git中的一种特殊模式，它本质上意味着将一次提交记作一项目录记录，而非将它记作一个子目录或者一个文件。

最后用`git push`推送commit到远程服务器分支上。

### 克隆子模块

接下来我们删除主项目，重新克隆已经包含子模块的主项目。当克隆这样包含子模块的项目时，默认会包含子模块的目录，但其中没有任何文件。
```bash
$ git clone git@github.com:Mybrc91/parentrepo.git
Cloning into 'parentrepo'...
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 6 (delta 0), reused 6 (delta 0), pack-reused 0
Receiving objects: 100% (6/6), done.
Checking connectivity... done.
$ cd parentrepo/
$ ls -al
total 42
drwxr-xr-x 1 cheng 197609  0 4月  13 22:06 ./
drwxr-xr-x 1 cheng 197609  0 4月  13 22:06 ../
drwxr-xr-x 1 cheng 197609  0 4月  13 22:06 .git/
-rw-r--r-- 1 cheng 197609 98 4月  13 22:06 .gitmodules
drwxr-xr-x 1 cheng 197609  0 4月  13 22:06 childrenrepo/
-rw-r--r-- 1 cheng 197609 14 4月  13 22:06 README.md
$ cd childrenrepo/
$ ls

```

其中的`childrenrepo`目录是空的。

回到`parentrepo`根目录，接下来运行`git submodule init`来初始化子模块的本地配置。
```bash
$ git submodule init
Submodule 'childrenrepo' (git@github.com:Mybrc91/childrenrepo.git) registered for path 'childrenrepo'

```
然后运行`git submodule update`来拉取子项目中的数据。
```bash
$ git submodule update
Cloning into 'childrenrepo'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
Checking connectivity... done.
Submodule path 'childrenrepo': checked out '86cc13948af71df1fc60ea956d099add7bb5af19'

```
现在的子项目`childrenrepo`已经和服务器的数据保持一致了。

还有一个更便捷的方式处理子模块，就是运行`git clone --recursive`加URL，就会自动初始化并更新主项目中的所有子模块。
```bash
$ git clone --recursive git@github.com:Mybrc91/parentrepo.git
Cloning into 'parentrepo'...
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 6 (delta 0), reused 6 (delta 0), pack-reused 0
Receiving objects: 100% (6/6), done.
Checking connectivity... done.
Submodule 'childrenrepo' (git@github.com:Mybrc91/childrenrepo.git) registered for path 'childrenrepo'
Cloning into 'childrenrepo'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
Checking connectivity... done.
Submodule path 'childrenrepo': checked out '86cc13948af71df1fc60ea956d099add7bb5af19'

```

### 在包含子模块的项目上工作

现在我们有一个包含子模块`childrenrepo`的主项目`parentrepo`，我们会同时在主项目和子模块项目上进行开发。

#### 拉取上游修改

最简单的处理方式就是只在子模块项目上获取更新，不在其目录中做任何更改。

要查看子模块的更新，可以进入子模块目录运行和主项目一样的更新操作，比如`git fetch`和`git merge`，来合并上游分支的更改到本地代码。
```bash
$ git fetch
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), done.
From github.com:Mybrc91/childrenrepo
   86cc139..fb0a986  master     -> origin/master
$ git merge origin/master
Updating 86cc139..fb0a986
Fast-forward
 README.md | 2 ++
 1 file changed, 2 insertions(+)

```

这时输入`$ git diff --submodule`,可以看到子模块已经更新到最新的提交。
```bash
$ git diff --submodule
Submodule childrenrepo 86cc139..fb0a986:
  > Update README.md

```

如果不想进去子模块目录更新，还有更便捷的方法`git submodule update --remote`，Git会自动更新所有子模块，也可以在命令后加子模块名，只更新指定子模块。
```bash
$ git submodule update --remote
Submodule path 'childrenrepo': checked out 'fb0a98642f03f8656696502650dac4a14f5194ee'
```

Git默认会checkout出子模块的master分支，可以通过修改`.gitmodules`文件指定分支，也可以通过命令`
git config -f .gitmodules submodule.childrenrepo.branch dev
`,修改后的信息如下：
```bash
$ cat .gitmodules
[submodule "childrenrepo"]
        path = childrenrepo
        url = git@github.com:Mybrc91/childrenrepo.git
        branch = dev

```

如果不加`-f .gitmodules`选项，那么只会修改本地配置，无法同步到服务器上，供他人使用。

这时运行`git status`命令，会显示子模块有新提交的信息。
```bash
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   childrenrepo (new commits)

no changes added to commit (use "git add" and/or "git commit -a")

```

再运行`git diff`，可以看到子模块的提交记录。
```bash
$ git diff
diff --git a/childrenrepo b/childrenrepo
index 86cc139..fb0a986 160000
--- a/childrenrepo
+++ b/childrenrepo
@@ -1 +1 @@
-Subproject commit 86cc13948af71df1fc60ea956d099add7bb5af19
+Subproject commit fb0a98642f03f8656696502650dac4a14f5194ee

```

最后运行提交命令，提交主项目的子模块更新，并推送到服务器分支。
```bash
$ git add .
$ git commit -m "update submodules"
[master 9adc3c3] update submodules
 1 file changed, 1 insertion(+), 1 deletion(-)
$ git push
Counting objects: 2, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 239 bytes | 0 bytes/s, done.
Total 2 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To git@github.com:Mybrc91/parentrepo.git
   404bef2..9adc3c3  master -> master

```

#### 在子模块上工作
...
### 子模块技巧
...
### 子模块问题
...





    