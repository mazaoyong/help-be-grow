---
- title: 高阶弹窗组件
- owner: 埃里克
- description: 基于zent dialog的一个高阶组件，解决dialog作为selector的排版和回掉问题（注：deprecated，被ebiz-component内的dialog取代）
- tag:
    - dialog
    - selector
    - shop
- cover: ''
---

# Dialog Selector 对话框选择器

### 适用场景
Zent Dialog的一个高阶组件，提供了创建dialog，提交dialog，打开/关闭dialog的回调方法

### 使用示例
* 校区选择器SchoolSelector(client/components/school-selector/index.js)
注：此组件仅为高阶包裹

### 使用说明
读取属性传入dialog, componentConfig为组件属性，包含{Foot, Filter，...listprops}自定义组件可传(Foot, Filter为自定义头部，脚部)， dialogConfig包含zent的dialog属性，及onSubmit, onClose, onOpen三个回调接口

### 注意事项
