---
order: 0
title: 基础用法
subtitle: Basic
---

你可以通过Grid的使用方式，来实现类似[订单列表](https://www.youzan.com/v4/trade/order/index#/)以及[评论列表](https://www.youzan.com/v4/vis/edu/page/evaluation#/list)类似的表单

```jsx
import { OrderTable } from '@youzan/ebiz-components';

function fetchData(filterConf, pageConf) {
  console.log(
    'filter conditions is -> ',
    filterConf,
    '\npage conditions is -> ',
    pageConf,
  );
  const { pageSize, pageNumber } = pageConf;

  return new Promise(resolve => {
    const now = new Date().getTime();
    const uniqueTag = now.toString().substr(-5);
    const times = new Array(pageSize).fill(0);
    const response = times.map(_ => ({
      foo1: '这是表头1的信息' + uniqueTag,
      foo2: '这是表头2的信息' + uniqueTag,
      bar1: '这是表格内容1的信息' + uniqueTag,
      bar2: '这是表格内容2的信息' + uniqueTag,
      bar3: '这是表格内容3的信息' + uniqueTag,
    }));

    resolve(response);
  }).then(data => ({
    datasets: data,
    total: 100,
    current: pageNumber,
  }))
}

// 基础用法
function BasicDemo() {
  const columns = [
    {
      title: '表头1',
      name: 'foo1',
      isHead: true,
    },
    {
      title: '表头2',
      name: 'foo2',
      isHead: true,
    },
    {
      title: '单元格1',
      textAlign: 'center',
      bodyRender({ bar1 }) {
        return '这是单元格内容:' + bar1;
      }
    },
    {
      title: '单元格2',
      name: 'bar2',
      width: '40%',
    },
    {
      title: '单元格3',
      name: 'bar3',
      textAlign: 'right',
    },
  ];

  // 扩展底部内容
  const renderExtend = row => {
    return <h4 style={{ padding: '10px' }}>{JSON.stringify(row)}</h4>
  };

  return (
    <OrderTable
      columns={columns}
      fetchData={fetchData}
      extend={renderExtend}
      pageSize={10}
    />
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```