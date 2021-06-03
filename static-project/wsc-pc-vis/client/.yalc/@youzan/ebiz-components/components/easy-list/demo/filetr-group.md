---
order: 11
title: 对Filter进行分组
subtitle: 
---

你可以通过将`Filter.config`使用数组将筛选项包裹来改变`Filter`最终的布局，每个数组都将单独占**一行**。

```jsx
import { EasyList } from '@youzan/ebiz-components';
const { Filter } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true, },
  { title: '发布时间', name: 'publishTime', needSort: true, },
];

const filterConfig = [
  [
    {
      name: 'orderNo',
      label: '订单号：',
      type: 'Input',
      defaultValue: '',
    }
  ],
  [
    {
      name: 'orderTime',
      label: '下单时间：',
      type: 'DateRangeQuickPicker',
    }
  ],
  [
    {
      name: 'orderType',
      label: '订单类型：',
      type: 'Select',
      defaultValue: '-1',
      options: [
        { text: '全部', value: '-1' },
        { text: '普通订单', value: 'normal' },
        { text: '代付订单', value: 'friends' },
      ],
    }, {
      name: 'activistStatus',
      label: '维权状态：',
      type: 'Select',
      defaultValue: '-1',
      options: [
        { text: '全部', value: '-1' },
        { text: '退款处理中', value: 'refunding' },
      ],
    },
  ]
]

class FiletrGroup extends React.Component {
  render() {
    return <Filter config={filterConfig} />;
  }
}

ReactDOM.render(<FiletrGroup />, mountNode);
```