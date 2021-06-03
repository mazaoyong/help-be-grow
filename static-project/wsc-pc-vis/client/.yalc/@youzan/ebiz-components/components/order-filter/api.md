---
category: 组件
type: 通用组件
title: 订单筛选项
subtitle: order-filter
description: 订单筛选条件
---

# Filter 知识付费通用搜索

### 适用场景
知识付费中的table内容筛选

### 使用示例
* 推荐有奖-推广效果(client/pages/pct/referral/EffectPage.jsx)
* 群打卡-编辑页面-打卡任务(client/pages/pct/punch/components/TaskList.jsx)
* 信息采集记录(client/pages/pct/record/order/index.jsx)

### 使用截图
![avatar](https://b.yzcdn.cn/public_files/8813cb08a2851d3701d04394d2850332.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
options | 搜索条件配置，目前仅有 input/select/checkbox,通过type、name、label、data, props 配置 | []
value | 搜索值 | {}
hides | 需要隐藏的元素 | {}
onChange | value改变的回调，把所有value的字段输出 | -
onSubmit | 提交的回调 | -


### 注意事项
搜索条件配置，目前仅有 input/select/checkbox,通 type、name、label、data, props 配置

### Changelog
- 2020-02-06
  - 修改filter样式