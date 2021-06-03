# Ebiz-Components

[![build status](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/badges/master/build.svg)](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/commits/master)

> [电商前端组件(或者其他类型的包）库](http://fedoc.qima-inc.com/ebiz-react-components/guidebook)，提供一些业务组件(或者其他类型的包）的封装

## 如何引用

在项目的package.json中加入对组件库依赖。
在项目的webpack配置中，使用babel-plugin-import插件，并在babel配置中加入以下配置
```js
module.exports = {
  plugins: [
    ['import', { libraryName: '@youzan/ebiz-components', libraryDirectory: 'es', style: (name) => `${name}/style/index.css` }, '@youzan/ebiz-components'],
  ],
};
```
由于组件库采用esm方式打包，所以需要babel-plugin-import插件配置引入相应的css样式文件

## 🚨警告

组件库的发版必须依靠项目或者日常发版

## 如何发布组件库

组件库发布流程需要按照以下顺序执行：

1. MR阶段：这个阶段，所有需要当前版本发布的组件库，需要将自己的开发分支的代码合并到feature/release分支上，并解决冲突；
   1. 每个MR都必须是项目或者日常所依赖的，并且**充分**经过自测或者是测试同学的测试；
   2. 每个MR都应该是对一个组件的修改，这样做的目的是，确保每次的修改都是针对一个组件的，并且这么做也能约束开发过程中的行为，防止一心二用；
2. 当MR完成，接下来的事情都由组件库`master`完成；
   1. 检查`version`是否合法，如果不合法，修改为上一次发布的版本号；
   2. 运行`make release`命令，根据需求选择`npm version tag`；
   3. 根据提示，点击链接跳转到`gitlab pipeline`操作打包；
   4. 完成打包之后，提交`feature/release`MR到`master`分支，标题内容带有版本号，`labels`选择`release`；
   5. 完成以上步骤之后，就是完成了一次组件库的打包，接下来需要打包文档；
   6. 打包文档需要在`feature/release`中运行`make deploy-site`命令，这个命令会根据MR生成对应的`ChangeLog`，这个`ChangeLog`涵盖所有合到`feature/release`并带有特定的`labels`的MR，具体`labels`的范围见`.changelog.config.yml`文件；
   7. 完成以上命令后，根据提示去`fe-doc`完成文档更新，并去`ops`平台完成发版；
   8. 最后将*可能改变*的`yml`一起随着`feature/release`分支合并到`master`分支，这个过程中**请勿选择LABELS**

## 如何开发

```bash
# 安装依赖
make install
# 开启开发服务器
make dev
```

## 添加组件

```bash
# 添加某个组件(或者其他类型的包）
make add
# 完成组件(或者其他类型的包）基本信息的填写
```

### 添加组件(或者其他类型的包）的一些约定

> 开发EbizComponents需要遵从一些约定，这些约定能够更好的规范你组件(或者其他类型的包）的文件结构以及帮助你更好的书写demo

1. 所有的组件(或者其他类型的包）的文件夹名字必须是分割线形式
2. 所有组件(或者其他类型的包）的文件为`*.ts`
3. 所有组件(或者其他类型的包）必须要有自己的`index.md`文件，并且每个`index.md`文件必须要有如下的`meta`信息
   1. **author** 你的大名，可以是一个数组，形式可以为字符串或者`(name)[avatar src]`这样的类型
   2. category 组件(或者其他类型的包）的分类
   3. type 组件(或者其他类型的包）的类型 （数据型或者是其他什么类型）
   4. title 组件(或者其他类型的包）的中文标题
   5. subtitle 组件(或者其他类型的包）的英文标题（一般为项目中引用的`ReactComponentName`)
   6. description 关于组件(或者其他类型的包）简短的描述
   7. 【非必填】tags 你给你组件(或者其他类型的包）设置的标签
   8. 【非必填】cover 组件(或者其他类型的包）的截图，请将图片上传cdn
4. 每个组件(或者其他类型的包）必须都要有自己的`api.md`文件，这个`api.md`文件的内容会放在组件(或者其他类型的包）文档的最下方
5. 请将每个`demo`独立成一个个的markdown文件放在`dmoe`目录下，并设置**title**和**subtitle**
6. `demo`的书写请务必不要使用绝对路径引用的方式，请使用如下方式

```javascript
import { xx } from '@youzan/ebiz-components'
```

## 发布组件

**正式版发布**
组件的发布将在`feature/release`分支完成！
请按照如下顺序发布：
1. 将改动发布`beta`版本；
2. 测试完成之后，提MR到`feature/release`分支；
3. 当发布人完成MR的处理之后，在当前分支下运行`make release`命令生成对应的`tag`，然后由pipeline执行后续的打包发版工作。

目前的发布人：
- 埃里克
- 逐浪

**beta版发布**
```bash
# 添加某个组件(或者其他类型的包）
make release-beta
# 完成组件(或者其他类型的包）基本信息的填写
```
执行后会发布beta版本，用于项目中开发调试，项目上线前须发正式版本

## Merge Request

**关于MR，请务必选择默认的MR模板，然后按照要求填入信息，完成之后删除说明部分**

### 添加依赖

请谨慎的添加依赖，**依赖要锁定版本号**

### 关于category和type配置

如果没有你想要的字段，你可以通过如下方法进行类别的添加

1. 打开`categoryAndType.js`文件
2. 按照格式添加

## 项目组件库升级

由于ebiz组件库处于建设阶段，版本更新比较频繁，建议项目开发者定期同步项目内ebiz-components版本，减少测试回归压力。
以目前wsc-pc-vis升级ebiz库为例，每周日常发车时，检查ebiz库是否有版本更新，若存在更新，则提日常跟车升级项目内版本，并根据changelog将改动和影响面同步给开发和测试，在日常内测试回归改动。
这样保证项目在需要依赖组件库高版本时，不会与当前版本差距过大，造成无法评估影响面的后果

## 写在最后

### 修改网站README文档

网站的`guidebook`在`docs`目录下

### 修改CHANGELOG

在编译文档网站的时候，会根据MR列表生成ChangeLog，如果想要手动生成ChangeLog以查看效果，请运行`make gen-changelog`命令，然后在`docs`目录下查看生成的CHANGELOG文件