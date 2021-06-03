---
order: 2
title: 组件默认方式渲染
subtitle: Basic
---

当组件的默认表现形式能够满足你的需求的时候，你能够通过方便的指定相应区块的`key`来很方便的渲染出各个区块的内容；

**key的作用等同于lodash/get的path参数**

### ⚠️为什么Operator都需要分别指定callback

我们默认认为每个operator都应该是一个有效的交互点，所以它必须要有自己的回调函数，否则就不能构成一个有效的交互点。

```jsx
import { CardList } from '@youzan/ebiz-components';
import { Notify } from 'zent';

const item = {
  title: '美国 Scratch 编程课',
  subtitle: '适用课程：编程课',
  courseTime: '20/30 （含赠送课时5）',
  availableTime: '2019-10-10 至 2020-10-10',
  class: '三年一班',
  registerTime: '2019-10-10 12:00:00',
  actuallyPaid: '¥1000.00',
  refound: '¥0.01',
  canDelete: false,
};

const fetch = pageInfo => {
  return new Promise(resolve => {
    setTimeout(() => resolve({
      datasets: new Array(pageInfo.pageSize).fill(0).map((_, index) => {
        const dataset = Object.assign({}, item, { id: index + pageInfo.current });
        return dataset;
      }),
      total: 100,
    }), 1500);
  });
}

const renderConfig = {
  title: 'title',
  subtitle: 'subtitle',
  contentGroup: [
    [
      {label: '课时', name: 'courseTime'},
      {label: '有效期', name: 'availableTime'},
      {label: '班级', name: 'class'}
    ],
    [
      {label: '报名时间', name: 'registerTime'},
      {label: '课程实付金额', name: 'actuallyPaid'},
      {label: '已退', name: 'refound'}
    ]
  ],
  operators: [
    {label: '删除', callback(data) { Notify.info(data.canDelete ? '删除成功' : '删除失败')}},
    {label: '添加VIP', callback() { Notify.success('添加VIP成功')}},
    {label: '退课', callback() {}},
    {label: '调班', callback() {}},
  ]
}

const BasicDemo = () => {
  return (
    <div style={{ width: '668px' }}>
      <CardList
        fetchData={fetch}
        renderConfig={renderConfig}
        pageInfo={{
          pageSize: 2,
        }}
      />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```