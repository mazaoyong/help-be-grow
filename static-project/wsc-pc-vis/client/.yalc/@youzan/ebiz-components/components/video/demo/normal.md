---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { Video } from '@youzan/ebiz-components';

const BasicDemo = (props) => {
  return <Video id="1" url="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" />;
};

ReactDOM.render(<BasicDemo />, mountNode);
```
