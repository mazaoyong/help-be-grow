---
- title: File Uploader 通用文件上传组件
- owner:
    - 逐浪
    - 赵梓皓
- description: File Uploader 通用文件上传组件
- cover: https://b.yzcdn.cn/public_files/73cee386a3b2c0223e64321f219def4e.png
- tag:
    - File Uploader
    - 文件上传
---

# File Uploader 通用文件上传组件

### 适用场景
不同于图片或者音频视频，这个通常用在导入文件的地方,用户上传csv或者excel之类的文件

### 使用示例
批量导入学员-上传文件(client/pages/edu/student-import/components/file-field/index.jsx)

### 使用截图
![avatar](https://b.yzcdn.cn/public_files/73cee386a3b2c0223e64321f219def4e.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
className | 类名 | -
fileLimit | 文件限制大小（MB) | -
typeRegEx | 文件类型 | -
tokenUrl | 用于获取token | //www.youzan.com/v4/vis/commom/material/getPrivateFileUploadToken.json
channel | 用于获取token | -
onChange | 用于展示上传成功的回调 | () => {}
onFail | 上传失败的回调 | () => {}
showNotify | 是否显示上传成功（或失败）的提示 v| true
uploadText | 点击上传的文案 | '点击上传文件'
clamp | 是否使用zent的clamplines组件 | false
clampWidth | width超过多少px后开始截断 | 180
showSize | 是否显示文件大小 | true
uploadFirst | 上传控件是否展示在说明文案前 | true

### 注意事项


### Changelog

2020.4.11 点击上传文案支持自定义
2020.4.21 添加文件clamp状态后缀格式
2020.4.26 把文件的size也作为onchange返回的参数
2020.5.29 添加uploadFirst字段
