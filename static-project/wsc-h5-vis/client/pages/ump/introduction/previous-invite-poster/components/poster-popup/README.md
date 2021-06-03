# {poster-popup}

海报弹窗

## 注意事项

暂无

## 使用方

- 转介绍制作海报页，路径：/wscvis/ump/introduction/invite-poster

## 参数说明

列举说明下用处，具体默认值类型等参考 props 定义

name | 说明 | 类型 | 可选值 | 默认值
-|-|-|-|-
v-model|类型|Boolean|true,false|false
width|宽度|Number|-|292
height|高度|Number|-|414
url|图片|String|-|-
fullfill|图片要锁|String|-| middle
text|提示文本|String|-| 长按图片可保存到相册
## 接入指南

给下接入的模板，例如：

```
<share-popup :v-model="showSharePopup" />

data() {
  return {
    showSharePopup: true,
  }
}
```

## changelog

1. 从下单页抽离出来的课程推荐

## 截图

- [截图1](https://img01.yzcdn.cn/)
