---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { LinkGroup } from '@youzan/ebiz-components';

const BasicDemo = props => {
  return (
    <div>
      <LinkGroup data={[{ text: 'action1' }, { text: 'action2' }]}/>
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```