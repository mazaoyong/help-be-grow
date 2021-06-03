---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { LockWrap } from '@youzan/ebiz-components';

const BasicDemo = (props) => {
  return (
    <div>
      <LockWrap lockType={'PCT_GOODS'} isLock={true} onClick={() => {}}>
        <a>风控锁</a>
      </LockWrap>
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```
