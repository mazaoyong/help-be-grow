---
category: 组件
type: 数据
title: 类订单表格
subtitle: OrderTable
description: 使用Grid方式渲染一个类似订单列表的组件
---

| 参数         | 说明                                         | 类型                                                     | 默认值           | 是否必填 |
| ------------ | -------------------------------------------- | -------------------------------------------------------- | ---------------- | -------- |
| columns      | 每一列所需要的数据                           | array[object]                                            | -                | Y        |
| fetchData    | 获取数据                                     | (filterConf, pageConf) => ({ datasets, total, current }) | -                | Y        |
| rowKey       | 在可选择的情况下必须要填写该字段             | string                                                   | -                | N        |
| emptyLabel   | 列表为空的提示文案                           | node                                                     | '没有更多数据了' | N        |
| selectable   | 是否支持选择                                 | boolean                                                  | false            | N        |
| onSelect     | 任意行被选中的时候触发回调                   | function(selectedRows: obeject)                          | -                | N        |
| onDataChange | 数据改变的时候触发该回调                     | function(data: datasets)                                 | -                | N        |
| extend       | 扩展信息，展示位置紧贴每一行的body，展示其下 | (record) => ReactNode                                    | -                | N        |
| zanQuery     | 查询条件，修改这个对象会触发table的刷新      | object                                                   | -                | Y        |
| pageSize     | 每页容量                                     | number                                                   | 20               | N        |

