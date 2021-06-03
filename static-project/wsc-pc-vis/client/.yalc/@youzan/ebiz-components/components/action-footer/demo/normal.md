---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { ActionFooter } from '@youzan/ebiz-components';

const BasicDemo = props => {
  return (
    <div>
      hello ActionFooter
      <ActionFooter />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```