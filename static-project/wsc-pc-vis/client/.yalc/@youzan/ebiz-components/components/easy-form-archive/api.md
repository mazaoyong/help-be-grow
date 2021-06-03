---
category: 组件
type: 数据
title: 表单
subtitle: EasyForm
description: 电商通用表单
---

#### FormRender

只列举比Form多出的属性

| 参数       | 说明                | 类型        | 默认值 | 是否必填 |
| ---------- | ------------------- | ----------- | ------ | -------- |
| config | 表单组件的配置 | IFormCreatorConfig[] | 无   | 是       |
| ref | 获取ZentForm对象 | ZentForm | 无   | 否       |
| preview | 右上角表单数据结构预览 | boolean | false   | 否       |

#### IFormCreatorConfig

只列举比Zent Field多出的属性

| 参数       | 说明                | 类型        | 默认值 | 是否必填 |
| ---------- | ------------------- | ----------- | ------ | -------- |
| component | 表单组件或者是展示组件 | ReactNode 或 Component | 无   | 是       |
| props | 组件props属性 | (form: ZentForm) => any | 无   | 否       |
| fieldProps | field相关的props属性 | (form: ZentForm) => any | 无 | 否 |
| type | 如果是类似zent的field，需要传field，暂无其他用处 | string |  无  | 否       |
| children | component会获取到children配置对应的jsx，以方便处理一些布局 | IFormCreatorConfig[] | 无 | 否
| watch | 监听值的变化，处理表单联动问题 | IFormWatch | 无 | 否
| show | 监听值的变化，处理显示隐藏问题 | IFormShow | 无 | 否

#### IFormWatch

| 参数       | 说明                | 类型        | 默认值 | 是否必填 |
| ---------- | ------------------- | ----------- | ------ | -------- |
| dep | 依赖表单值 | string或string[] | 无   | 是       |
| fn | 回调，data与dep对应（一个则是单值，多个则是按照dep顺序的数组） | (data: value[]或value, form: ZentFormCtx) => void | 无   | 是       |

#### IFormShow

| 参数       | 说明                | 类型        | 默认值 | 是否必填 |
| ---------- | ------------------- | ----------- | ------ | -------- |
| value | 是否显示（没有依赖的时候使用或混合情况）| boolean | true | 否 |
| dep | 依赖表单值 | string或string[] | 无   | 是       |
| fn | 回调，data与dep对应（一个则是单值，多个则是按照dep顺序的数组） | (data: value[]或value, form: ZentFormCtx) => boolean | 无   | 是       |
