---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { TempAlertInfo } from '@youzan/ebiz-components';
const { PunchAlert, IOSBuyAlert } = TempAlertInfo;

const BasicDemo = props => {
  return (
    <div>
      <PunchAlert />
      <IOSBuyAlert />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```