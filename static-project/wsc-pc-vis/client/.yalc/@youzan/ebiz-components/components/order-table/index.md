---
category: 组件
type: 数据展示
title: 类订单表格
subtitle: OrderTable
author:
  - 逐浪
description: 使用Grid方式渲染一个类似订单列表的组件
cover: https://b.yzcdn.cn/cdn/order-table.png
tags:
  - 类似订单列表
  - Grid用法
---

> *不支持排序*

> 一个形如订单列表的一个组件，设计api类似于zent/table思路，同样使用columns数组来渲染数据，渲染如下形式的表格：

```text
+--------------------------------------------+
+          表头（渲染表格单元的标题）            +	HEADER
+--------------------------------------------+
+ ItemHead.val0 + ItemHead.val1 + ...        +
+--------------------------------------------+	BODY
+ ItemBody.val0 + ItemBody.val1 + ...        +
+--------------------------------------------+
					 ……
+--------------------------------------------+
+ batch actions +                 pagenation +	FOOTER
+--------------------------------------------+
```

## columns

#### 基本格式

[见zent/table的columns](https://youzan.github.io/zent/zh/component/table#columns)

#### columns属性的异同点

于zent/table不同的是，`columns`属性会屏蔽掉一些用不到的字段（或者说是在这个组件中寒意不明的字段），新增一些特有的字段，来达到渲染出一个表格的目的。

```powershell
- isMoney 删除这个属性，这个属性没什么用
- needSort, sortBy 删除排序属性，这个列表不需要支持排序
+ isHead 新增isHead属性，用于标识数据中的应该展示在表头的数据，默认为false
```
