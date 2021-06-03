# {recommend-list}

更多精选课程推荐列表

## 注意事项

暂无

## 使用方

- 转介绍老学员活动页，路径：/wscvis/ump/introduction/old-student

## 参数说明

列举说明下用处，具体默认值类型等参考 props 定义

name | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
showRecommend|类型|Boolean|true,false|true

## 接入指南

给下接入的模板，例如：

```
<recommend-list :show-recommend="showRecommend" />

data() {
  return {
    showRecommend: false,
  }
}
```

## changelog

1. 从下单页抽离出来的课程推荐

## 截图

- [截图1](https://img01.yzcdn.cn/)
