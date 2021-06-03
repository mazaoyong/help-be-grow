---
- title: 商品选择器组件V2
- owner: 逐浪
- description: 基于EduGoodsSelector包装的一个组件，包含实物商品，同时还包含一个已选择的列表
- cover:
- tag:
    - GoodsSelectorV2
    - 商品选择器
    - 实物商品
---

## 使用场景

需要选择实物商品的场景，可以使用这个选择器组件，如果仅仅是使用教育商品，请移步`ebiz-components/edu-goods-selector`组件。

## 默认行为

- 默认操作部分只有删除按钮
- 商品列表名称会跳转到相对应的商品详情页

## API

| 属性名          | 描述                                                   | 类型                                                         | 是否必填 | 默认值   |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------ | -------- | -------- |
| label           | 标签名                                                 | string                                                       | true     | -        |
| goodsList       | 已选择商品列表列表，数据应该符合商品列表的格式         | `IGoods[]`                                                   | true     | -        |
| umpConfig       | 商品活动设置，必须配置 activityType 才能使用商品选择器 | -                                                            | true     | -        |
| onChange        | 添加商品列表回调                                       | `(goodsDataList: IGoods[]) => void`                          | true     | -        |
| required        | 必填的样式                                             | boolean                                                      | false    | -        |
| loading         | 列表加载状态                                           | boolean                                                      | false    | false    |
| helpDesc        | 提示信息                                               | ReactNode                                                    | false    | -        |
| width           | 列表的宽度                                             | string                                                       | false    | 520px    |
| triggerText     | 添加商品列表按钮的触发文案                             | string                                                       | false    | 添加商品 |
| attachColumns   | 已选择商品列表列表除了商品列表名称和操作之外的内容     | IGridColumn[]                                                | false    | -        |
| renderOperators | 渲染操作部分，可以用这个属性覆盖默认行为               | `(goodsData: IGoods, gridPos: IGridCellPos) => React.ReactNode` | false    | -        |
| onDelete        | 删除商品列表回调                                       | `(goodsData: IGoods) => void`                                | false    | -        |

## ChangeLog

- 20200826 添加
- 20200914
  - 删除「图文」筛选项
  - 修改「线下课」的value
- 20201009
  - 基于EduGoodsSelector包装。`ebiz-components/edu-goods-selector` 组件已支持营销活动配置，支持实物商品选择
