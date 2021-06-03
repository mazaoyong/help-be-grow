---
category: 组件
type: 展示
title: 自定义选择器
subtitle: custom-selector
description: 通用的选择弹框组件
---

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