---
category: 组件
type: 通用组件
title: 图片压缩显示
subtitle: img-wrap
description: 图片压缩显示
---

#### API

| 参数              | 说明           |   类型    |     默认值     | 可选值 |
| :---------------- | :------------- | :-------: | :------------: | :----: |
| `src`             | 图片地址       | `string`  |       无       |  必填  |
| `alt`             | 图像的替代文本 | `string`  |      `''`      |   -    |
| `width`           | 容器宽         | `string`  |     `auto`     |   -    |
| `height`          | 容器高         | `string`  |     `auto`     |   -    |
| `backgroundColor` | 容器背景色     | `string`  |   `#e2eefd`    |   -    |
| `cover`           | 是否填充显示   | `boolean` |    `false`     |   -    |
| `prefix`          | class 前缀     | `string`  |   `img-wrap`   |   -    |
| `fullfill`        | 压缩选项       | `string`  | `!100x100.jpg` |   -    |
| `watermark`       | 水印           | `string`  |      `''`     |   -    |
| `disableFullfill` | 关闭压缩       | `boolean` |    `false`     |   -    |

- fullfill 是使用 [fullfillImage](http://fedoc.qima-inc.com/utils/function/index.html#static-function-fullfillImage) 方法对图片进行压缩，只对 `/yzcdn\.cn/.test(src)===true` 的图片有效，默认为 `!100x100.jpg`，可以通过 `disableFullfill` 关闭压缩。