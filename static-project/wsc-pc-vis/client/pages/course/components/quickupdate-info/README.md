##  QuickUpdateInfo 快速编辑/行内编辑

导入路径`client/pages/pct/common/components/quickupdate-info/`

### 适用场景

该组件用作在组件中需要快速编辑的部分，通常用在表格单元格中，如

- [课程/在线课程/直播/列表页/序号](https://www.youzan.com/v4/vis/pct/page/live#/list)
- [课程/在线课程/内容/列表页/序号、标题](https://www.youzan.com/v4/vis/pct/page/content#/list)
- [课程/在线课程/专栏/列表页/序号、标题](https://www.youzan.com/v4/vis/pct/page/column#/list)

此外，还用在了[LiveItem 直播课程展示](../live/item)组件中。

它只是单元格原有内容旁边的一个 icon 图标，点击时会弹出 popup（[ShortCutPop](../../../../pages/edu/course-manage/components/course-table/components/shortcut-pop.jsx)组件）。

popup 包括一个输入框和一对保存｜取消按钮，点击保存就会执行更改操作。

### 使用指南

该组件依赖于[ShortCutPop](../../../../pages/edu/course-manage/components/course-table/components/shortcut-pop.jsx)组件，请先查阅其文档。

### 代码演示

![image-20191105191433347](https://b.yzcdn.cn/plus/one/second/image-20191105191433347.png)

![image-20191105191729995](https://b.yzcdn.cn/plus/one/second/image-20191105191729995.png)

```jsx
// file: client/pages/pct/column/containers/list/index.jsx

import QuickUpdateInfo from '../../../common/components/quickupdate-info';

let columns = [
  {
        title: '专栏',
        width: '25%',
        bodyRender: (item, { row }) => {
          return (
            <div className="grad-with-img grad-img-16-9">
              <div className="img-box">
                <ImgLockWrap
                  isLock={item.is_lock}
                  width="80px"
                  height="45px"
                  src={item.cover}
                  fullfill="!100x100.jpg"
                />
              </div>
              <div className="content-box">
                <div style={{ display: 'flex' }}>
                  <a
                    className="name ellipsis-2"
                    href={item.redirect_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.title}
                  </a>
                  {chainSupportModify && !item.has_product_lock && item.column_type !== 1 && (
                    <QuickUpdateInfo
                      rowData={item}
                      row={row}
                      quickUpdateCallback={this.quickUpdateCallback('title').bind(this)}
                      type="title"
                    />
                  )}
                </div>
                <div style={{ display: 'flex' }}>
                  <div className="price">
                    {item.column_type === 1 && (
                      <Tag style={{ marginRight: 5 }} className="fenxiao-tag" color="#4b8">
                        分销
                      </Tag>
                    )}
                    ¥ {(item.price / 100).toFixed(2)}
                    {item.price_info && (
                      <WarningTip
                        self={this}
                        item={item}
                        text={item.price_info}
                        actionText="忽略该消息"
                        type="price_info"
                      />
                    )}
                  </div>
                  {chainSupportModify && !item.has_product_lock && item.column_type !== 1 && (
                    <QuickUpdateInfo
                      rowData={item}
                      row={row}
                      inputType="number"
                      width={80}
                      quickUpdateCallback={this.quickUpdateCallback('price').bind(this)}
                      type="price"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
 ]

```



### API

| 参数                | 说明                                                         | 类型         | 默认值 | 是否必填 |
| :------------------ | :----------------------------------------------------------- | :----------- | :----- | :------- |
| row                 | 编辑目标所在行的行索引                                       | `Number`     | 无     | 否       |
| width               | 宽度，透传给 ShortcutPop 组件                                | `Number`     | 400    | 否       |
| type                | 编辑目标的类型，见下面的解释                                 | `String`     | 无     | 是       |
| rowData             | 编辑目标所在的单元格的信息对象，见下面的解释                 | `Object`     | `{}`   | 是       |
| inputType           | 编辑目标的类型，也决定了弹出的输入框的 `type`，作为 `type` prop 透传给 ShortcutPop 组件 | `String`     | `''`   | 否       |
| quickUpdateCallback | 快速编辑框提交时触发的回调函数，下面有参数说明               | `Function()` | 无     | 是       |

先解释一下` rowData` 与 `type`：

假设我们的单元格有标题和价格两个内容，这个单元格的数据如下：

```javascript
{
  title: '标题',
  price: '1.0',
}
```

我们要修改的是标题，那就把这个对象作为 `rowData` 参数，而把 `'title'` 作为 `name` 参数传给这个组件。

组件内部会获取 `rowData[type]` 并把它作为 `defaultValue` 参数传给 ShortcutPop 组件。

一般来说，`type` 只会用到 `'title'` 和 `'price'` 两个值，且为 `'price'` 的时候组件内部会把它格式化一下（`x/100`）。



##### `quickUpdateCallback ` 参数说明

该函数与 ShortcutPop 组件的 `onOK` 回调参数类似，实际上该组件内部做了一层转换。

```javascript

quickUpdateCallback(name, index, value, useSku, alias);
```

`name` 即传入的 type 参数

`index` 即传入的 row 参数

`value` 即输入框输入的新值

`useSku`这里为 false

`alias ` 编辑目标所属的课程的 `alias`

# CHANGELOGS

- js -> tsx: @chenzihao
