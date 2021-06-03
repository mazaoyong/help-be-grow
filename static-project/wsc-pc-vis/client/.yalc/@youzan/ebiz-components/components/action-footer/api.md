---
category: 组件
type: 展示
title: 吸底操作栏
subtitle: action-footer
description: 底部保存，取消
---

| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
| mainText | primary button文案 | string | 否 | '保存'
| subText | outline button文案 | string | 否 | '取消'
| mainDisabled | primary button是否禁用 | boolean | 否 | false
| subDisabled | outline button是否禁用 | boolean | 否 | () => {}
| onMainClick | primary button点击回调函数 | Func | 否 | () => {}
| onSubClick | outline button点击回调函数 | Func | 否 | () => {}
| className | outline button点击回调函数 | string | 否 | ''
| mainSamName | 是否是samButton | string | 否 | ''
| mainOptions | primary button其余button属性 | object | 否 | null
| subOptions | outline button其余button属性 | object | 否 | null
