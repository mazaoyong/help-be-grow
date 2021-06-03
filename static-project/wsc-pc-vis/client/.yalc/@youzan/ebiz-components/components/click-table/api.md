---
category: 组件
type: 展示
title: 双栏表格
subtitle: click-table
description: 分级数据展示
---

name | 说明 | 默认值
-|-|-
loading | 是否正在加载 | false
columns | 表头信息 | []
datasets | 表格数据 | []
emptyLabel | 无表格数据时的展示文案 | 没有更多数据了
scroll | overflow样式，数据结构为：<br>scroll?: {<br>&nbsp;&nbsp;x?: number,<br>&nbsp;&nbsp;y?: number,<br>};<br>如果设置了y值，则设置max-height=y，且overflowY设置为scroll；如果设置了x值，暂没有overflow和max-height的处理。 | -
currentRow | 判断选中的行是否为当前行的回调函数，传入当前行，返回是否为当前行 | -
disabledRow | 判断选中的行是否为禁用的回调函数，传入当前行，返回是否禁用 | -
onClickRow | 点击当前行的回调 | -