---
- title: Audio Uploader 音频上传组件
- owner:
    - 埃里克
- description: Audio Uploader 音频上传组件
- cover: https://b.yzcdn.cn/public_files/b3ef4e7e70fb984f0c90cb91312b2aeb.png
- tag:
    - Audio Uploader
    -  音频上传组件
---

# Audio Uploader 音频上传组件

### 适用场景
用于音频上传

### 使用示例
* 小测试-题目设置-音频(client/pages/pct/exam/blocks/TitleSettingForm.jsx)
* 知识付费-内容-音频(client/pages/pct/content/EditPage.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/b3ef4e7e70fb984f0c90cb91312b2aeb.png)
![](https://b.yzcdn.cn/public_files/2b33b9729f781b50022ea026977e8ff4.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
value | 音频Object：<br>audioObj = {<br>&nbsp;&nbsp;path: conf.content,<br>&nbsp;&nbsp;size: conf.audio_whole_size,<br>&nbsp;&nbsp;name: conf.audio_whole_name,<br>}; | {}

### 注意事项

### changelog
2019-11-18：新增加宽泛上传白名单检查，如果在白名单，那么允许上传audio/* video/* 格式的音频

2020-02-07：修改音频上传提示文案，把原有三种格式更新为五种

2020-02-25：优化音频上传失败时的提示

2020-06-16： 增加上传limit 500m,保留白名单逻辑，白名单 + 教育店铺 都允许