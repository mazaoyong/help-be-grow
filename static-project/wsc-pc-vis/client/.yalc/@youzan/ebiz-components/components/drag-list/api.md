---
category: 组件
type: 数据展示
title: 拖拽列表
subtitle: DragList
description: 提供一个组件，用于创建一个可以拖拽的列表，并且在拖拽完成时能够通知顺序的改变
---

| 属性名         | 描述                                                             | 类型                                                          | 是否必填 | 默认值  |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- | -------- | ------- |
| rowKey         | 每一行的唯一 key，支持 lodash 的 get 语法                        | string                                                        | 是       | -       |
| fetchDatasets  | 获取数据的函数，没有入参，不接受分页数据                         | `fetchDatasets(): Promise<Record<string, any>[]>`             | 是       | -       |
| className      | 样式列表                                                         | string                                                        | 否       | -       |
| icon           | 图标的 type                                                      | `IIConProps['type']`                                          | 否       | drag    |
| iconSize       | 图标的大小                                                       | string                                                        | 否       | -       |
| iconColor      | 图标的颜色                                                       | string                                                        | 否       | #999    |
| columns        | 每一行的渲染配置                                                 | `IDragColumn<DataType>[]`                                     | 是       | -       |
| noData         | 没数据的时候显示的占位内容                                       | React.ReactNode                                               | 否       | -       |
| filter         | 筛选函数，如果返回`false`，表示无法拖拽                          | `(rowData: DataType) => boolean`                              | 否       | -       |
| onOrderChange  | 当拖拽完成之后的回调函数，入参是当前排序的数据和上一次排序的数据 | `(curDatasets: DataType[], prevDatasets: DataType[]) => void` | 否       | -       |
| disabledAnchor | 禁用拖拽的行的锚点样式                                           | `ReactNode`                                                   | 否       | `<td/>` |
| swap           | 开启交换模式，交换模式下，排序只有在松开选项的时候才会触发       | boolean                                                       | false    | -       |
| swapClass      | 交换节点的样式名                                                 | string                                                        | 否       | -       |
| ghostClass     | 被拖拽的时候产生的幽灵节点的 class，默认为透明不显示             | string                                                        | 否       | -       |
| dragClass      | 被拖拽的节点的 class                                             | string                                                        | 否       | -       |
| dragClass      | 被选中的节点的 class                                             | string                                                        | 否       | -       |

## IDragColumn<DataType>

```typescript
interface IDragColumn<DataType> {
  title: React.ReactNode; // 展示的标题
  name: string;
  // 🚨DragList是固定表头的形式，width是必须的！
  width: number;
  bodyRender?(rowData: DataType): React.ComponentType<any>;
  helpDesc?: React.ReactNode; // 提示文案
  textAlign?: React.CSSProperties['textAlign']; // 文字对齐方式
  defaultText?: React.ReactNode;
}
```
