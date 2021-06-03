---
category: 组件
type: 展示
title: 收银台
subtitle: casher
description: 收银台
---

| 属性名           | 属性描述            | 类型      | 是否必填 | 默认值               |
| --------------- | ------------------ | -------  | ------- | ------------------- |
| orderNo         | 订单编号            | string   | 是      |                     |
| price           | 实付价格（分）       | number   | 是      |                     |
| payUrl          | 付款码URL           | string   | 是      |                     |
| prePayId        | 预支付单号           | string   | 是      |                     |
| getWscQrcodeApi | 获取二维码API        | function | 是      |                     |
| getOrderInfoApi | 获取订单付款信息API   | function | 是      |                     |
| getPayToolsApi  | 获取自定义支付方式API | function | 是      |                     |
| onPay           | 处理点击支付         | function | 是      |                     |
| onCancel        | 处理取消支付         | function | 是      |                     | 