---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { ClickTable } from '@youzan/ebiz-components';

const BasicDemo = props => {
  return (
    <div>
      hello ClickTable
      <ClickTable />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```