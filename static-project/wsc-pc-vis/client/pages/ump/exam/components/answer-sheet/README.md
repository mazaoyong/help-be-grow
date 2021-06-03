---
- title: 趣味测试 - 答题卡组件
- owner:
  - 胡学望
- description: 用于趣味测试展示用户信息、用户答题结果（对错题数、答题详情）等信息，支持查看具体答卷的锚点跳转
- cover: 'https://b.yzcdn.cn/public_files/25e7d28a30c5e4f9a69d6df5648e5bad.png'
- tag:
  - 答题卡
---

# 趣味测试 - 答题卡组件

### 适用场景
用于趣味测试展示用户信息、用户答题结果（对错题数、答题详情）等信息，支持查看具体答卷的锚点跳转

### 使用示例
* 趣味测试查看答卷(client/pages/ump/exam/components/answer-sheet/index.tsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/25e7d28a30c5e4f9a69d6df5648e5bad.png)

### 使用说明
分为Title、Header、ResultTable三个部分
#### API
name | 类型 | 说明 | 默认值
-|-|-
id | number或string | 音频唯一id，为了兼容多个音频相同的情况 | -
audioUrl | string  | 音频 | -
mediaName | string | 音频名称 | -
width | string | 控件宽度 | 364px
height | string | 控件高度 | 68px

### 注意事项


### Change log

2020.2.19 修改样式 by 赵梓皓