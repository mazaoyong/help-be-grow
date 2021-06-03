# Icon 图标

## 添加 icon

- 把设计师给的 svg 图标放在 `common/assets/icons/` 目录下
- 在项目里安装 `@youzan/iconfont`，然后执行 `sh decorate-components/iconfont.sh`

## 预览

打开 `common/assets/fonts/decorate.html`。

## 其他

如果生成的 iconfont 长得不符合预期，一般可以通过联系设计师调整 svg 输出文件解决，具体看下：

![img](https://img.yzcdn.cn/public_files/2019/06/09/a2db567a6645fe36c2ce7591b69eda96.png)


## 以下是老的添加图标方式，不再使用
1. 到 [iconfont](https://www.iconfont.cn) 注册帐号，然后让杰强大哥给你添加项目权限；
2. 把设计给你的 svg 图标上传到 iconfont 项目上，记得去除颜色；
3. 上传图标后，可以编辑相应的图标，修改引用该图标的类名，如图：
 [编辑](https://img.yzcdn.cn/public_files/2019/02/14/d5881256f3f87c066268d350acf4d4df.png)
 [修改类名](https://img.yzcdn.cn/public_files/2019/02/14/3d6e4beb32d14ab698a03721fb5dbeb4.png)
4. 如果不想上传到项目的图标被公开搜索到，可以到自己的图标库中删除，如图：
 [删除图标](https://img.yzcdn.cn/public_files/2019/02/14/cfb4c30a4f723a312e51269113ca7b9d.png)
5. 把生成的项目包下载至本地，把字体图标的相关文件（eot/woff/woff2/ttf/svg）上传到 CDN，然后替换`./style/index.scss`中的相应路径；
6. 在`./style/index.scss`中追加新的图标样式（可以从下载的项目包中的样式文件中复制过来）；
7. 把 svg 图标文件放在项目的 `decorate-component/common/assets/icons`；

可参考commit: c82f8d63ea55db0c664da621f6e519ad90753c61;
