---
- title: 课程商品卡片展示
- owner:
  - 埃里克
- description: 课程商品在表格单元格内的展示
- cover: https://b.yzcdn.cn/plus/one/second/image-20191105100549227.png
- tag:
  - 课程商品
---

##  CourseGoodsItem 课程商品卡片展示

导入路径` client/pages/course/components/course-goods-item`

### 适用场景

该组件用作在表格的单元格中展示在线课程(目前仅支持直播课程，预计未来支持更多类型的课程展示)，如：

- [课程/在线课程/直播/列表页](https://www.youzan.com/v4/vis/pct/page/live#/list)

- [课程/在线课程/专栏/内容管理页/列表](https://www.youzan.com/v4/vis/pct/page/column#/content/360h6nham5u2f)

- [课程/在线课程/专栏/内容管理页/添加内容弹窗](https://www.youzan.com/v4/vis/pct/page/column#/content/360h6nham5u2f)

该组件包括分为左右两部分

- 左侧是课程的预览图，当课程锁定时会显示锁定图标（[ImgLockWrap 组件](../../../../../components/img/img-lock-wrap)）
- 右侧是课程的信息，包括：
  - 上方的课程标题
  - 下方的课程价格及「试看」标签

其中，课程价格和试看标签会根据传入的课程信息来决定显示与隐藏，具体请看[API](#api)一节。

另外，课程标题和课程价格在传入可编辑参数时，是可以行内快速编辑的（详见[快速编辑组件](../../quickupdate-info)）。

### 使用指南

该组件应当作为 [「Zent Grid-Column 组件」](http://fedoc.qima-inc.com/zent-beta/zh/component/grid#columns)的 `bodyRender` prop 中使用。

### 代码演示

从下列图片可以看出，该组件会自行控制价格、试看标签的显示与否，具体请看[API](#api)一节。

![image-20191105100549227](https://b.yzcdn.cn/plus/one/second/image-20191105100549227.png)



![image-20191105101624849](https://b.yzcdn.cn/plus/one/second/image-20191105101624849.png)

同时，如果`canEdit`参数为 `true`，标题和价格都是支持行内编辑的（使用[快速编辑组件]()实现）。

![image-20191105101816876](https://b.yzcdn.cn/plus/one/second/image-20191105101816876.png)

```jsx
// file: client/pages/course/live/containers/list/list.tsx

import LiveItem from '../../../common/components/live/item';

quickUpdateCallback = (type) => {
  return (name, index, value, useSku = false, alias) => {
    const liveQuickUpdateCommand = {
      productAlias: alias,
      [type]: type === 'price' ? value * 100 : value,
    };
    quickUpdateLiveByAlias({ liveQuickUpdateCommand }).then(resp => {
      this.VisTable.refetchData.refresh(true);
    }).catch(err => {
      Notify.error(err);
    });
  };
}

let columns = [
  {
    title: '直播',
    width: '25%',
    bodyRender: (item, { row }) => <CourseGoodsItem
      item={item}
      row={row}
      canEdit={true}
      quickUpdateCallback={this.quickUpdateCallback.bind(this)}
    />,
  }
 ]

```



### API

| 参数                | 说明                               | 类型                    | 默认值  | 是否必填 |
| :------------------ | :--------------------------------- | :---------------------- | :------ | :------- |
| Item                | 课程信息对象                       | `Object`                | 无      | 是       |
| row                 | 表格中的行索引，透传给快速编辑组件 | `Number`                | `0`     | 否       |
| canEdit             | 是否可以快速编辑                   | `Boolean`               | `fasle` | 否       |
| quickUpdateCallback | 快速编辑框提交时触发的回调函数     | `Function(type:String)` | `false` | 否       |

其中，`quickUpdateCallback`函数接受一个`String`类型的参数，表示编辑的部位，值为`title`（标题）或`price`（价格）。它应当返回一个柯里化后的函数作为[快速编辑组件的`quickUpdateCallback`prop](../../quickupdate-info#api)。

下面说明` item` 的字段对该组件显示效果的影响:

- 当 `canEdit === true` 且 `item.has_product_lock === false` 时才会显示快速编辑

- 当 `item.seller_type` 值为` 1` （单篇销售）或 `3` （单篇和专栏）时价格才会显示

- 当` item.is_free === true` 时试看标签才会显示

### changelog
- 20200229 直播二期 增加直播类型标签 @gaotian
