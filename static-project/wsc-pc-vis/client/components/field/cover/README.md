---
- title: Cover 上传图片（封面）组件
- owner:
    - 埃里克
- description: Cover 上传图片（封面）组件
- cover: https://b.yzcdn.cn/public_files/9578b67310e1437d4dae15ddee6d1181.png
- tag:
    - Cover 
    - 封面上传
---

# Cover 上传图片（封面）组件

### 适用场景
适用于上传图片的场景(现已有可压缩图片的组件new-cover，见../new-cover)

### 使用示例
会员权益-会员权益封面(client/pages/pct/benefit/components/benefit-form/index.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/9578b67310e1437d4dae15ddee6d1181.png)
![](https://b.yzcdn.cn/public_files/ee9b6e2ef8f27aa4b66e4f9e23721f86.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
value | 图片url或图片object（图片object格式为：<br>pictureData: {<br>&nbsp;&nbsp;cover: '',<br>} | -
detail | 是否需要图片详情 | false
maxAmount | 允许上传图片的最大数量 | 1
accept | 接受的文件类型（字符串形式） | 'image/gif, image/jpeg, image/png, image/bmp'
uploadCls | 上传控件的类名 | -
onChange | 修改后的回调 | -
ckt | 是否开启主题模板 | -

### 注意事项