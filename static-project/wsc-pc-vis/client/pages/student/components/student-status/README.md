---
- title: 学员状态标签
- owner: 逐浪
- description: 通过type展示学员状态的标签
- cover: https://b.yzcdn.cn/cdn/学员标签.png
- tag:
    - type
    - 标签
---

## 标签样式

![学员标签](https://b.yzcdn.cn/cdn/学员标签.png)

默认通过传入 type 的值展示试听、结业和在读三个标签；

## 自定义标签、标签样式

StudentStatus 可以通过扩展以下字段来展示不同类型的标签和其对应的标签样式：

- customerStatus string[] 状态列表，由一系列状态描述组成;
- customerColors [fontColor, borderColor, bgColor][] 由三个为一组的若干组颜色数据组成，与`customerStatus`的状态一一对应。

### Eg.

```tsx
const customStatus = ['请假', '在读'];
const customerColors = [
  ['#66BE74', '#66BE74', '#F0FAF2'],
  ['#333333', '#C8C9CC', '#F2F3F5'],
];

<StudentStatus type={0} customStatus={customStatus} customerColors={customerColors} />;
// 展示为请假以及自定义样式的第一个的配色
```

## API

| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|type|状态类型|number|是| - |
|customStatus|自定义的状态列表|string[]|否| - |
|customerColors|与状态相对应的状态配色|[string, string, string][]|否| - |
|style|自定义样式|CSSProperties|否| - |
