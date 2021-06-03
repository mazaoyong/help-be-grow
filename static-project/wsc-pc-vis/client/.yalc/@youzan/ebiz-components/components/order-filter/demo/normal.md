---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { OrderFilter } from '@youzan/ebiz-components';
import { Button } from 'zent';
const options = [
  {
    type: 'Select',
    name: 'status',
    label: '售卖状态：',
    data: [
      {
        value: '0',
        text: '全部',
      },
      {
        value: '1',
        text: '更新中',
      },
      {
        value: '2',
        text: '停止更新',
      },
    ],
    props: {
      placeholder: '全部',
    },
  },
  {
    type: 'Input',
    name: 'keyword',
    label: '专栏名称：',
  },
];
const BasicDemo = (props) => {
  return (
    <div>
      hello OrderFilter
      <OrderFilter options={options}>
        <Button type="primary" onClick={() => this.getPunchTaskList(1)}>
          筛选
        </Button>
        <span className="cursor-link filter-clear" onClick={() => this.onClear()}>
          重置筛选条件
        </span>
      </OrderFilter>
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```
