---
- title: Video Uploader 视频上传组件
- owner:
    - 埃里克
    - 赵梓皓
- description: Video Uploader 视频上传组件
- cover: https://b.yzcdn.cn/public_files/189a16fb258da63a2fbce65726f164a4.png
- tag:
    - Video Uploader
    - 视频上传组件
---

# Video Uploader 视频上传组件

### 适用场景
上传视频

### 使用示例
* 线下课-线下课视频(client/pages/edu/course-manage/components/EditForm.jsx)
* 小测试-题目设置-题目格式(视频)(client/pages/pct/exam/blocks/TitleSettingForm.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/189a16fb258da63a2fbce65726f164a4.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
value | 视频信息(Ojbect类型) {<br>&nbsp;&nbsp;video_id: '',&nbsp;&nbsp;path: '',&nbsp;&nbsp;name: '',&nbsp;&nbsp;size: '',<br>}
tips | 视频上传说明 | 点击 + 选择视频，视频大小不超过3G，建议时长10~30分钟，宽高比16:9，<br>支持mp4，mov，m4v，flv,x-flv，mkv，wmv，avi，rmvb，3gp格式
helpDescs | 帮助说明 | 为了提升视频播放流畅度，我们对此处上传的视频做了技术处理，建议不要在知识付费以外的地方使用该视频
onChange | 选择视频发生变化的回调

### 注意事项
