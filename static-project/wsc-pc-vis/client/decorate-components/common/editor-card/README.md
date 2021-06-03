# EditorCard 基础的拖拽排序组件
props 类型及其默认值看代码

## 自定义添加按钮
如果要高度定制添加按钮，可以把`selfDefinedText`设为`true`，然后整个添加按钮都会被传入的`addText`替换掉

```html
<EditorCard selfDefinedText addText={<div>自定义</div>}>
```

## 设定某些条目不可拖拽
`canDrag`默认是`true`，意味着全部条目都可拖拽。也可以给`canDrag`传递一个函数，该函数入参是条目的索引，返回`true`则拖拽，`false`则禁用该条目的拖拽

首项禁用拖拽:
```html
<EditorCard canDrag={index => index !== 0}>
```
