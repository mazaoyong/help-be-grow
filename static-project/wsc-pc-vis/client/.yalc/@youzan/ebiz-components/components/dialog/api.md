---
category: 组件
type: 展示
title: 气泡弹窗
subtitle: Dialog
description:
---

## oepnDialogOption

| 属性名          | 描述                                                 | 类型               | 是否必填 | 默认值                |
| --------------- | ---------------------------------------------------- | ------------------ | -------- | --------------------- |
| data            | props.data（继承至 Dialog 的类型断言）               | P                  | 否       | null                  |
| dialogId        | 唯一标识                                             | string             | 否       | Date.now().toString() |
| title           | 自定义弹框标题                                       | ReactNode          | 否       | -                     |
| closeBtn        | 是否显示右上角关闭按钮                               | boolean            | 否       | true                  |
| mask            | 是否显示遮罩                                         | boolean            | 否       | true                  |
| maskClosable    | 点击遮罩是否可关闭                                   | boolean            | 否       | true                  |
| parentComponent | 父组件的引用, 用于关联 context                       | ReactInstance      | 否       | -                     |
| className       | 自定义额外类名                                       | string             | 否       | -                     |
| prefix          | 自定义前缀                                           | string             | 否       | -                     |
| style           | 内联样式                                             | CSSProperties      | 否       | -                     |
| submitEffect    | submit 的副作用函数，如果返回 false，不会关闭 dialog | `Promise<boolean>` | 否       | -                     |

## dialogRef

| 属性名 | 描述                       | 类型              | 是否必填 | 默认值                |
| ------ | -------------------------- | ----------------- | -------- | --------------------- |
| close  | 关闭弹窗                   | () => void        | 否       | null                  |
| submit | 提交数据并关闭按钮，会根据submit的副作用函数的返回值决定后续的逻辑 | (data: T) => void | 否       | - |

