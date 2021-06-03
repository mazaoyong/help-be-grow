---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { PopEllipsisText } from '@youzan/ebiz-components';

const BasicDemo = props => {
  return (
    <div>
      <h3>限制显示字数的时候，你还可以指定tagName</h3>
      <PopEllipsisText text="hello PopEllipsisText" tagName="div" count={10} />
      <h3>通过渲染虚拟节点来判断</h3>
      <PopEllipsisText text="hello PopEllipsisText" width={80} renderVirtualNode />
      <h3>通过选择器来指定父节点</h3>
      <div className="parentNode" style={{ width: '200px' }}>
        <div className="temp">
          <PopEllipsisText text="hello PopEllipsisText hello PopEllipsisText hello PopEllipsisText" selector=".parentNode" />
          <PopEllipsisText text="hello PopEllipsisText hello PopEllipsisText hello PopEllipsisText" selector=".parentNode" />
        </div>
      </div>
      <div className="parentNode" style={{ width: '70px' }}>
        <span className="temp">
          <PopEllipsisText text="hello PopEllipsisText" selector=".parentNode" />
        </span>
      </div>
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```