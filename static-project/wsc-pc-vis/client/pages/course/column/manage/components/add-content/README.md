# 专栏 - 添加内容弹窗

## 2020-05-08
bug修复
具体改动：
1、在列表组件`utils.tsx`中的`renderColumnImgItem`方法新增了一个参数，在本组件中传此参数特别标识为·添加内容·的列表
2、新建内容按钮绑定事件变更

## 2020-04-21
变更需求：将新建内容按钮关联至tabs
具体改动：
1、移除对`zant`中`Popover`与`Menu`组件的引用
2、移除对`fns/chain`中`ShowWrapper`的引用；3、移除`chainSupportSingleShowWrapper`的引用；
4、新增字符串数组`key`来储存四个`tabs`对应的英文表示
5、修改`handleAddClick`的参数，来达到关联`tab`的效果
6、移除“内容”组件中的价格显示，将“价格”显示在此页面
7、“不可选原因”列，新增跳转链接
