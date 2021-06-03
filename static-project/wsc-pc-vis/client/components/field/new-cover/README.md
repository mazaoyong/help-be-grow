---
- title: New Cover 图片上传组件
- owner:
    - 埃里克
- description: New Cover 图片上传组件
- cover: https://b.yzcdn.cn/public_files/9578b67310e1437d4dae15ddee6d1181.png
- tag:
    - Cover
    - 图片上传
    - 封面
---

# New Cover 图片上传组件

### 适用场景
适用于大多数图片上传的场景

### 使用示例
* 线下课-分销员海报(client/pages/edu/course-manage/fields/distributor-poster/index.jsx)
* 知识付费商品-封面(client/pages/pct/content/EditPage.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/9578b67310e1437d4dae15ddee6d1181.png)
![](https://b.yzcdn.cn/public_files/ee9b6e2ef8f27aa4b66e4f9e23721f86.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
uploadCls | 上传控件的类名 | -
needDetail | 是否需要高清图，如果设为false则会返回缩略图 | false
maxAmount | 允许上传图片的最大数量 | 1
value | 图片信息，包含缩略图和图片详情信息，具体数据结构为：<br>cover: url,<br>picture: {<br>&nbsp;&nbsp;attachment_full_url: url,<br>&nbsp;&nbsp;attachment_id: pic.attachment_id,<br>&nbsp;&nbsp;cover: url,<br>&nbsp;&nbsp;height: pic.height,<br>&nbsp;&nbsp;id: pic.attachment_id,<br>&nbsp;&nbsp;width: pic.width,<br>}, | -
extraComponent | 额外的Component | -
onChange | 修改后的回调 | -
tips | 图片上传组件的帮助说明 | -

### 注意事项


### ChangeLog

#### 20200426 

修改组件实现中直接更改 props 而不触发重新渲染导致的图片删除失效问题。

#### 20200816

新增tips字段，用于展示图片上传组件的帮助说明

#### 20200818
新增单个图片上传的prop
needHoverDelete: 是否需要鼠标移入时展示delete图标
needBlur: 是否需要高斯模糊
onCoverImgClick: 选中图片后，点击图片的回调

#### 20200819
新增单个图片上传的预览组件


