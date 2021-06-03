---
order: 0
title: 默认使用方法
subtitle: Normal use
---

这里演示DragList组件的基本用法；

> 警告⚠️
> 
> DragList组件，对于`filter`结果为`false`的组件，会默认放在底部，并且不参与排序！！！

```jsx
import { DragList } from '@youzan/ebiz-components';

const fetch = () => {
  const datasets = new Array(30).fill(1).map((_, index) => ({
    videoName: '视频名字' + Number(index),
    videoDuration: 60000,
    videoStartTime: 123,
    videoStatus: index % 2 === 0 ? '进行中' : null,
    id: index,
  }));

  return new Promise((resolve) => {
    setTimeout(() => resolve(datasets), 500);
  });
};

const BasicDemo = () => {
  return (
    <DragList
      fetchDatasets={fetch}
      rowKey="id"
      filter={(rowData: any) => /视频名字[124589]*$/.test(rowData.videoName)}
      onOrderChange={console.log}
      columns={[
        {
          title: '视频名称',
          name: 'videoName',
          width: 500,
          helpDesc: '查看视频名称',
        },
        {
          title: '视频时长',
          name: 'videoDuration',
          width: 400,
        },
        {
          title: '直播开始时间',
          name: 'videoStartTime',
          width: 180,
          nowrap: false,
        },
        {
          title: '状态',
          name: 'videoStatus',
          textAlign: 'right',
        },
      ]}
    />
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```