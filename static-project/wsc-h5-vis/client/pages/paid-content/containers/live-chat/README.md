## 实现所有区域的音频播放状态同步

1、对已经存在的音频 vm，通过监听 Bus 的各种事件，判断 msgId 是否相同进行展示音频播放样式

2、不存在的音频通过滑动异步加载时，在 created 事件中判断

```
(!this.audio.get('paused') && this.audio.get('__msgId') === this.item.fromMsg.msgId)
```

进行播放样式展示

3、在拿到数据时会在各自区域对数据做个区分

```
areaName // main talk
areaType // socket normal
normal 代表历史数据 socket 代表实时传递来的数据
```

4、黑屏 系统操作 home 键，在 ios 中录音时会触发 onVoiceRecordEnd 事件