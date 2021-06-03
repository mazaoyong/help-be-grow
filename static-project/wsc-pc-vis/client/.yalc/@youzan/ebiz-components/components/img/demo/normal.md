---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { Img } from '@youzan/ebiz-components';

const { ImgWrap } = Img
const VIDEO_DELETE_URL = 'https://img.yzcdn.cn/public_files/2019/10/12/video_delete.png';
const BasicDemo = props => {
  return (
    <div>
      <ImgWrap 
        width="100px"
        height="56px"
        src={VIDEO_DELETE_URL}
        fullfill="!100x100.jpg"
      />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```