---
- title: Form-kit 表单中自定义元素
- owner:
  - 埃里克
- description: Form-kit 表单中自定义元素
- cover: https://b.yzcdn.cn/public_files/1f9bad9adbdd044abdd34d591c0daf16.png
- tag:
  - Form-kit
  - 表单中
  - 自定义元素
---

# Form-kit 表单中自定义元素

### 适用场景
1. Form
  * Customised form element: 可在表单中嵌入所需类型的标签（例如在表单中插入表格）
  * Customised element validator: 可自定义嵌入表单元素的校验方法
2. Form Item
  * 用法类似于ZentForm的Field，用来封装各种表单元素组件（如 Input、Checkbox、Select等，需自行传入）的一个高阶组件

### 使用示例
* Form 线下课-线下课规格(client/pages/edu/course-manage/fields/stock-detail/StockItem.js)
* Form Item 暂无

### 使用截图
![](https://b.yzcdn.cn/public_files/1f9bad9adbdd044abdd34d591c0daf16.png)

### 使用说明
#### API
1. Form
name | 说明 | 初始值
-|-|-
className | 类名 | ''
component | 在表格中嵌入的标签类型 | div
state | 传入数据 | -
onChange | 变化的回调 | -
validation | 自定义校验方法 | -

2. Form Item
className, label, labelClass, labelDesc, children, style, inline
name | 说明 | 初始值
-|-|-
className | 类名 | ''
label | 标签值 | ''
labelClass | 标签类名 | ''
labelDesc | 标签详细介绍 | ''
style | 附加样式 | ''
inline | 是否inline | undefined

### 注意事项
