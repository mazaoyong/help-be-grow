---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { DownloadImage } from '@youzan/ebiz-components';

const BasicDemo = props => {
  return (
    <div>
      hello DownloadImage
      <DownloadImage text="下载图片" download="示意图" url="https://img01.yzcdn.cn/upload_files/2021/03/19/FispnJh9FKiebwpWx1VrnZqnKur9.png"/>
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```
