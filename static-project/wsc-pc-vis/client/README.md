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

确定需要更新的话在项目根目录执行:

```
git submodule foreach "git checkout master && git pull"
git add client/shared client/webpack
git commit -m "Update submodules"
```

## 5. 文件命名规范

两个规则

1. 所有文件/文件名都是小写，除了字母和数字外还可以包含 `-` 字符
2. 规则一有个例外，React 组件的文件名保持和类名一致

## 6. 目录结构

JavaScript 项目中的深层目录嵌套会有许多痛点。在目录之间书写相对的 import 以及在移动文件时更新这些 import 都变得更加困难。除非你有一个非常有说服力的理由来使用深层文件夹结构，否则请考虑将项目自身限制为单个项目中最多嵌套三到四层文件夹。

```
.
├── README.md             # 说明文件
├── components            # 公用组件，如图片上传等业务无关地的组件
│   └── component1        # 组件以文件夹的形式组织，该组件和其 scss 文件放在一起
│       ├── index.jsx     # 组件以 index.jsx 命名，方便导入
│       ├── style.scss    # 样式文件命名为 style.scss
│       └── README.md     # 组件说明
├── constants             # 公用常量
├── fns                   # 公用函数
├── sass                  # 公用样式
│   ├── common            # 公用 sass class
│   ├── fns               # 公用 sass 函数
│   ├── mixins            # 公用 sass mixin
│   └── vars              # 公用 sass 变量
├── shared                # 有赞 PC 共享代码仓库
├── webpack               # 打包配置文件
└── pages
    ├── edu-admin               # 在线教育，项目结构同下
    └── cource                  # 课程相关
        ├── README.md           # 文档说明
        ├── api                 # 课程相关公用接口
        ├── components          # 会跨项目用到的组件
        ├── constants           # 存放一些业务常量，枚举值，配置等
        └── project             # 项目名
            ├── api(.js)                # 接口放在该文件/文件夹下
            ├── config(.js)             # 项目的配置文件，一些常量或者初始化变量放在该文件/文件夹下
            ├── utils                   # 工具方法，项目用到的一些抽象方法放在改目录下
            │   └── func1.js            # 以方法名命名文件，一个文件不要写多个方法
            ├── components              # 项目公用组件，多个页面之间共享
            │   └── component1          # 组件以文件夹的形式组织，该组件和其 scss 文件放在一起
            │       ├── index.jsx       # 组件以 index.jsx 命名，方便导入
            │       └── style.scss      # 样式文件命名为 style.scss
            ├── containers              # 页面组件放在该文件夹下
            │   └── page1               # 页面组件，与路由对应
            │       ├── index.jsx       # 组件以 index.jsx 命名，方便导入
            │       ├── style.scss      # 样式文件命名为 style.scss
            │       └── components      # 页面私有组件，该目录下的组件不要嵌套，组织方式同公用组件
            ├── routes.js               # 路由
            ├── constants.js            # 存放一些业务常量，枚举值，配置等
            └── main.js                 # 入口文件
```