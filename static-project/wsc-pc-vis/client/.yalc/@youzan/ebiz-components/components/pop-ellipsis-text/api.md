---
- title: 文字气泡
- owner: 梓皓
- description: 展示某个数量的文字，然后超出文字数量之后隐藏超出部分的文字，并在鼠标悬浮的时候显示所有内容
- cover: https://b.yzcdn.cn/cdn/ellipsis-pop.png
- tag:
    - 文字处理
    - 超出隐藏
    - 气泡显示
---

## API

| 属性名            | 描述                                                              | 类型                        | 是否必填 | 默认值     |
| ----------------- | ----------------------------------------------------------------- | --------------------------- | -------- | ---------- |
| text              | 需要处理隐藏的文字                                                | string                      | 是       | -          |
| count             | 最多显示多少文字                                                  | number                      | 是       | -          |
| defaultText       | 备选文字，当文字能够转换为 false 的时候展示的文字                 | string                      | 否       | -          |
| tagName           | 节点名                                                            | keyof HTMLElementTagNameMap | 否       | -          |
| renderVirtualNode | 是否通过渲染虚拟节点来控制隐藏，需要配合 width 属性               | boolean                     | 否       | false      |
| width             | 宽度                                                              | number                      | 否       | -          |
| selector          | 选择器，寻找父节点中符合条件的节点                                | string                      | 否       | -          |
| position          | 气泡的位置                                                        | PopPosition                 | 否       | top-center |
| deferEllipsis     | 延迟设置 ellipsis 属性，用于需要使用弹性计算的场景，比如 table 中 | boolean                     | 否       | false      |
| nowrap     | 是否不允许内容换行 | boolean                     | 否       | true      |
