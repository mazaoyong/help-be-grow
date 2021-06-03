---
- title: 讲师设置
- owner:
  - 埃里克
- description: 讲师设置
- cover: https://b.yzcdn.cn/plus/one/second/image-20191105150650610.png
- tag:
  - 讲师设置
---

##  showTeacherQrcode 讲师设置

导入路径` client/pages/pct/common/components/live/teacher-dialog`

### 适用场景

该组件用于直播课程的「讲师设置操作」，如：

- [课程/在线课程/直播/列表页/操作-讲师设置](https://www.youzan.com/v4/vis/pct/page/live#/list)

该组件是一个弹窗，标题为「直播创建成功，请设置直播间管理员」，主体包括：

- 一个二维码
- 一个提示文案

### 使用指南

它不是一个组件，而是一个命令式的函数，是对 [Zent 中 openDialog](http://fedoc.qima-inc.com/zent/zh/component/dialog#opendialog) 的包装，应该导入之后调用它。

### 代码演示

![image-20191105150650610](https://b.yzcdn.cn/plus/one/second/image-20191105150650610.png)


```jsx
// file: client/pages/pct/common/components/live/item-menu/index.jsx

import showTeacherQrcode from '../teacher-dialog';

<LockWrap
  lockType="PCT_GOODS"
  isLock={isLock}
  className="ui-link--split"
  onClick={() => showTeacherQrcode(info)}
>
  讲师设置
</LockWrap>

```

### API

这个函数仅接受一个参数

| 参数   | 说明                               | 类型            | 默认值 | 是否必填 |
| :----- | :--------------------------------- | :-------------- | :----- | :------- |
| qrcode | 直播课程信息或二维码图片 base 编码 | `Object|String` | 无     | 是       |

传入的直播课程信息应该是如下结构



```javascript
  const info = {
    live_id: item.id,
    alias: item.alias,
    kdt_id: window._global.kdtId,
  };
```

