---
category: 组件
type: 通用组件
title: 轮询任务定时器组件
subtitle: timing-task
description:  轮询任务定时器组件
---

# Timing Task 轮询任务定时器组件

### 适用场景
用于执行轮询任务

### 使用示例
* 排课 - 批量删除排课日程(client/pages/edu-admin/schedule/containers/panel/components/table/index.tsx)

### 使用截图
暂无

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
time | 最长时限 | 10000 （10秒）
interval | 多久发起一次查询结果的请求 | 500 （0.5秒）

### 注意事项
