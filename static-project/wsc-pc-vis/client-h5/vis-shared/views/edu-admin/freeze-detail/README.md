## freeze-detail 冻结明细组件

> 属于预约签到能力线

在对学员某节课进行签到操作时，遇到学员被冻结了部分课时，导致无法签到，可以选择取消冻结

### props

```javascript
    tip: {
      type: String,
      default: '', // 顶部的提示文案
    },
    params: {
      type: Object,
      default() {
        return {}; // 调接口的入参
      },
    },
    fetchPromise: {
      type: Function,
      required: true, // 列表请求 promise
    },
    removePromise: {
      type: Function,
      required: true, // 取消预约 promise
    },
    buttonText: {
      type: String,
      default: '移除', // 底部 button 的文字
    },
    removeSuccessText: {
      type: String,
      default: '移除成功', // 移除成功的文案
    },
    themeMainColor: {
      type: String,
      default: '#00b389', // 主题色
    },
```

![](https://b.yzcdn.cn/public_files/65a1e13e5f97e6336adb0718586bcfa6.png)