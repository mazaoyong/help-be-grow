---
order: 1
title: 控制自定义渲染
subtitle: Custom Render
---

如果默认的渲染样式不满足需求，还可以通过使用自定义渲染的方式来渲染：
- renderTitle
- renderSubtitle
- renderOperators
- renderContent

上面四个方法，入参都为渲染当前卡片的data，具体取决于你fetchData方法返回的datasets的格式。

```jsx
import { CardList } from '@youzan/ebiz-components';
import { Notify, Tag } from 'zent';

const TAG_THEME = ['green', 'blue', 'red'];
const TAG_STATUS = ['上课中', '课程结束', '退课'];

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
        const dataset = Object.assign({}, item, { id: index, tag: index % 3 });
        return dataset;
      }),
      total: 100,
    }), 1500);
  });
}

const renderConfig = {
  renderTitle(rowData) {
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ marginRight: '8px' }}>{rowData.title}</div>
        <Tag theme={TAG_THEME[rowData.tag]} outline style={{ verticalAlign: 'center' }}>{TAG_STATUS[rowData.tag]}</Tag>
      </div>
    );
  },
  subtitle: 'subtitle',
  renderContent(rowData) {
    return (
      <div>{rowData.courseTime}</div>
    )
  },
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
          pageSize: 5,
        }}
      />
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```