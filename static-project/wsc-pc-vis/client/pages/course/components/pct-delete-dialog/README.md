## openDeleteDialog 知识付费课程删除确认

导入路径 ` client/pages/pct/common/components/pct-delete-dialog`

### 适用场景

这是一个命令式调用函数，用来弹出知识付费课程对话框，适用于需要删除前确认的地方，如：

- [课程/在线课程/内容/列表页/操作-删除](https://www.youzan.com/v4/vis/pct/page/content#/list)
- [课程/在线课程/专栏/列表页/操作-删除](https://www.youzan.com/v4/vis/pct/page/column#/list)
- [课程/在线课程/直播/列表页/操作-删除](https://www.youzan.com/v4/vis/pct/page/live#/list)

注：下文中的 TYPE 指代知识付费课程的类型，如「内容」「专栏」「直播」。

它表现为一个对话框，标题为「删除 TYPE」，内容为：

- 若有人订阅此课程则显示：
  - 一个提示文案——「这篇 TYPE 有 0 位用户已订阅，删除后，已订阅用户将无法继续查看，你确定永久删除吗？」，若为专栏，还有一句「删除专栏不会删除专栏中的内容」
  - 一个输入框——「请输入：【永久删除】」，输入后才可以进行操作
  - 一个「永久删除」按钮，当输入框输入了才可点击，点击后执行删除操作，一个「我再想想」按钮，点击后关闭对话框
- 若无人订阅此课程则显示：
  - 一个提示文案——「删除后不可恢复，你是否确认删除这篇 TYPE ？」
  - 一个「删除」按钮，点击后执行删除操作，一个「取消」按钮，点击后关闭对话框

### 使用指南

它不是一个组件，而是一个命令式的函数，是对 [Zent 中 openDialog](http://fedoc.qima-inc.com/zent/zh/component/dialog#opendialog) 的包装，应该导入之后调用它。

它接受一些参数，请看[API](#api)一节。

### 代码演示

删除专栏：

![image-20191105174429302](https://b.yzcdn.cn/plus/one/second/image-20191105174429302.png)

删除内容：

![image-20191105174505952](https://b.yzcdn.cn/plus/one/second/image-20191105174505952.png)




```javascript
// file: client/pages/pct/column/containers/content/index.jsx

import { openDialog as openDeleteDialog } from '../../../common/components/pct-delete-dialog';


handleDeleteClick(alias) {
  openDeleteDialog({
    alias,
    type: 'content',
    onDelete: () => this.delete(alias),
  });
}
```

### API

这个函数接受一个 `Object` 类型的 `options `参数，这个对象有如下字段：

| 字段      | 说明                               | 类型            | 默认值  | 是否必填 |
| :-------- | :--------------------------------- | :-------------- | :------ | :------- |
| alias     | 课程的 alias                             | `String`        | 无   | 是   |
| type      | 删除课程的类型，`'content'` /`'live'` /` 'column'` 三者之一 | `String` | 无 | 是      |
| onDelete | 点击「永久删除」按钮触发的回调，该回调不接受任何参数        | `Function` | 无 | 是      |

