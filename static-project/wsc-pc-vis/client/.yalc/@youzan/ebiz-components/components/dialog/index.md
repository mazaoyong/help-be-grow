---
category: 组件
type: 通用组件
title: 弹窗
subtitle: Dialog
author:
  - Eric
description: 优化后的zent弹窗，使用Promise方式来调用
cover:
tags:
  - 函数式调用
  - Promisify
---

## 简介

这是`Zent.Dialog`组件的一个优化版本，使用函数的方式进行调用，使用方式类似`Promise`，在`Promise.Body`内调用`submit`会触发`PromisifyDialog.resolve`关闭操作则会触发`reject`

## 怎么方便的写一个loadingButton？

`openDialog`的第一个入参，会有以下三个入参：

1. data 传入dialog的组件的属性值
2. dialogref dialog的引用，可以使用dialogref上的`close`和`submit`方法来关闭弹窗
3. loadingState 如果指定了`submitEffect`副作用函数，点击绑定了`submit`方法的按钮时，会根据
   这个方法返回的`boolean`值来设置`loadingState`的状态