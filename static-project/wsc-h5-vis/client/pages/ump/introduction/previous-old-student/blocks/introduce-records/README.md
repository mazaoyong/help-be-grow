# {introduce-records}

我的邀请记录

## 注意事项

暂无

## 使用方

- 转介绍老学员活动页，路径：/wscvis/ump/introduction/old-student
- 转介绍绘制海报页，路径： /wscvis/ump/introduction/invite-poster

## 参数说明

列举说明下用处，具体默认值类型等参考 props 定义

name | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
v-model|类型|Boolean|true,false|false

## 接入指南

给下接入的模板，例如：

```
<introduce-records v-model="showIntroduceRecords" />

data() {
  return {
    showIntroduceRecords: true,
  }
}
```

## changelog

1. 单独抽出邀请记录弹窗

## 截图

- [截图1](https://img01.yzcdn.cn/)
