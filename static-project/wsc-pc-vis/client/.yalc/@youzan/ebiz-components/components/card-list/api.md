---
category: 组件
type: 数据展示
title: 卡片列表
subtitle: CardList
description: 用于展示卡片列表，一般用于展示课程列表；卡片包含卡片头部以及内容区域，能够通过传入opreators来渲染操作部分
---

| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| renderConfig | 渲染卡片的配置 | ICardRenderProps | 是 | - |
| fetchData | 获取数据的函数 | FetchData | 是 | - |
| pageInfo | 分页配置信息 | IGridPageInfo | 否 | - |
| rowKey | unique key | string | 否 | - |
| colorSchema | 颜色配置对象，在renderConfig不指定render函数的时候，会应用相对应的颜色信息 | IColorSchema | 否 | - |
| className |  | string | 否 | - |
| headerClassName | 卡片标题、副标题和操作部分的样式名 | string | 否 | - |
| contentClassName | 卡片内容部分的样式名 | string | 否 | - |
| updatingSignal | 更新的信号量，是外部更新CardList的途径，更新这个值能够触发重新获取列表信息 | number | 否 | - |
| emptyLabel | 列表为空的时候展示的内容 | ReactNode | 否 | 没有更多数据了 |

```typescript
import { IGridPageInfo } from 'zent';

type FetchData = (
  pageInfo: IGridPageInfo
) => Promise<{ total: number; datasets: RowData[]; pageSize?: number; }>;

interface IColorSchema {
  primaryColor?: string;
  secondaryColor?: string;
  interactionColor?: string;
  descriptionColor?: string;
  contentColor?: string;
}
```



### ICardRenderProps

通过配置不同显示区块的`key`或者通过使用`render`方法来展示该区块的内容，相应的`property`和`render`方法都是可选的，但是必须指定一个。

| 属性名          | 描述                | 类型                                                    | 是否必填 | 默认值 |
| --------------- | ------------------- | ------------------------------------------------------- | -------- | ------ |
| title           | 标题的key           | string                                                  | 否       | -      |
| renderTitle     | 标题的渲染函数      | IRenderFunc                                             | 否       | -      |
| subtitle        | 副标题的key         | string                                                  | 否       | -      |
| renderSubtitle  | 副标题的渲染函数    | IRenderFunc                                             | 否       | -      |
| contentGroup    | 内容的key组成的数组 | IContentUnit[][]                                        | 否       | -      |
| renderContent   | 内容的渲染函数      | IRenderFunc                                             | 否       | -      |
| operators       | 操作方法的数组      | ReactNode\|IOperatorUnit<Value>\|IOperatorUnit<Value>[] | 否       | -      |
| renderOperators | 标题的渲染函数      | IRenderFunc                                             | 否       | -      |

**下面是相关的 interface 和 type**

```typescript
interface ICardRenderProps<Value> {}

type IRenderFunc = (rowData: Record<string, any>) => ReactNode;

interface IContentUnit {
  label: string;
  name: string;
  render?(data: any): ReactNode;
}

interface IOperatorUnit<Value> {
  label: string;
  callback: GenericFunc<Value>;
}
```



