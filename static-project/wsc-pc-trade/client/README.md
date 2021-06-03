# 常见问题

首先，请先了解这几个必须知道的常识：

* 项目根目录：指的是包含 app 以及 client 这两个目录的那个目录，不是 client！！
* git submodule basic explanation: https://gist.github.com/gitaarik/8735255

## 1. shared 或者 webpack 目录为什么是空的？

shared 以及 webpack 是通过 git submodule 维护的，如果目录为空请在项目根目录执行 `make install`。

## 2. shared 或者 webpack 目录的内容不对？

同 1。

## 3. 如何修改 shared 或者 webpack 的代码？

从 master 切一个新分支出来，改完代码发 MR。

## 4. 如何更新项目中使用的 shared 或者 webpack submodule 版本？

更新前清确保知道自己在干什么，搞不清楚的话找项目负责人帮你更新。

确认需要更新的话在项目根目录执行:

```
git submodule foreach "git checkout master && git pull"
git add client/shared client/webpack
git commit -m "Update submodules"
```

## 5. 文件命名规范

两个规则

1. 所有文件/文件名都是小写，除了字母和数字外还可以包含 `-` 字符
2. 规则一有个例外，React 组件的文件名保持和类名一致
