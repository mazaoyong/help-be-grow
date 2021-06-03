---
- title: 学员选择弹窗组件
- owner:
  - 逐浪
- description: 通用的选择弹框组件，目前仅用于学员选择。
- cover: https://b.yzcdn.cn/txy/2019/select-user.png
- tag:
  - 学员
  - 学员选择
  - dialog

---

# Student-select 组件

>通用的选择弹框组件，目前仅用于学员选择，**优势在于异常强大的配置灵活性**

## 使用场景

需要灵活配置的弹窗组件，如下图所示

![](https://b.yzcdn.cn/txy/2019/select-user.png)

## 使用教学

以上图为例，如何通过配置Student-select组件编写页面。

首先我们看到这个弹窗分为四个部分，弹窗外壳，头部筛选，主体列表，还有底部按钮。因此我们配置信息结构如下：

```
  {
    // 头部筛选
    header: {
      component: <div></div>,
      children: [],
    },

    // 主体列表
    table: {
      columns: [],

      rowKey: 'assetNo',

      getRowConf: (data, index) => {},

      selection: {
        selectedRowKeys: [],
        isSingleSelection: false,
        needCrossPage: true,
      },
    },

    // 底部按钮
    footer: {
      component: <div></div>,
    },

    // 弹窗外壳
    title: '选择学员',

    onSelect: selectedData => Promise.resolve(),

    onFetch: ({ header, table, footer }) => Promise.resolve(),

    onSubmit: data => Promise.resolve,
  }
```

### 生命周期

我们可以配置 Student-Select 的生命周期函数。Student-Select *自身*的生命周期函数主要有三个，onSelect，onFetch 和 onSubmit。

当点击搜索，点击筛选，点击翻页，选择器内部的 fetch 事件被触发，就会尝试获取数据，调用 onFetch 生命周期函数。

当选择**主体列表**的一行或者多行，就会调用 onSelect 生命周期函数，用于处理这些被选择的行数据。注意：onSelect 的执行时机优先于 table 的 getRowConf 函数，也就是说我们可以在 getRowConf 中拿到被 onSelect 处理后的列表。

当点击确认，就会调用onSubmit函数，获取被选择的列表数据。

### 配置详解

1. header
    * component 附加信息，比如示例中的头部提示文案，或者可以存放自定义筛选组件列表，提到下文的 children 筛选组件列表。
    * children 默认筛选组件列表，支持 Button，Select，Search，Checkbox 四种类型的默认筛选组件，以及自定义的筛选组件

2. table 参见 zent/table

3. footer
    * component 附加信息，可以存放自定义组件列表。

### 强大的自定义组件

自定义组件的 props 如下

```
header: any; // 所有头部信息
table: any; // 所有列表信息
footer: any; // 所有底部信息
loading: boolean; // 是否加载中

fetch: () => void; // 获取数据，触发 onFetch
submit: () => void; // 提交数据，触发 onSubmit
cancel: () => void; // 关闭弹窗
change: (value: any) => Promise<any>; // 根据自定义所处的区域(header/table/footer)修改当前区域的state
```

## demo
```jsx
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|        |                     |                                                      |         |                     |
