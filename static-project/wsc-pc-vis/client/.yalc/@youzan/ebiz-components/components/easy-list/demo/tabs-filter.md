---
order: 12
title: Tabs作为筛选项
subtitle: Filter based tabs
---

## 使用场景

有些时候，某个选项会以`tabs`的作为筛选条件参与筛选，所以就需要一个仅仅用于筛选的`tabs`组件，
与`Search`使用方式类似，都需要传入一个`name`作为字段名；

## 注意点

需要注意的是，即使**Tabs 组件与 Filter 组件在 List 中公用一个 filter 对象**，但是，在 Filter 的
reset 行为中，**不会将`Tabs`组件的状态重置！**这个需要注意。

```jsx
import { EasyList } from '@youzan/ebiz-components';
const { List, Filter, Tabs } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true },
  { title: '发布时间', name: 'publishTime', needSort: true },
];

const BASE_OPTIONS = [
  { text: '选项1', value: '0' },
  { text: '选项2', value: '1' },
  { text: '选项3', value: '2' },
];

const filterConfig = [
  {
    name: 'input',
    label: '输入框：',
    type: 'Input',
    inheritProps: {
      placeholder: '请输入你想输入的文案',
    },
  },
  {
    name: 'select',
    label: '选择类型：',
    type: 'Select',
    options: BASE_OPTIONS,
    inheritProps: {
      placeholder: '请选择你想要的选项',
    },
  },
];

const tabs = [
  { label: '体验课', value: '0' },
  { label: '正式课', value: '1' },
];

const TabsFilter = (props) => {
  const fetch = (...args) => {
    console.log('submit:', ...args);
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        id: i,
        title: `标题${i}`,
        updatedAt: '2019-04-07',
        operatorName: `修改人${i}`,
        publishTime: '2019-04-07',
      });
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dataset: list,
          pageInfo: {
            page: 1,
            pageSize: 10,
            total: 30,
          },
        });
      }, 2000);
    });
  };
  return (
    <List onSubmit={fetch} defaultFilter={{ courseType: '0' }}>
      <Filter config={filterConfig} onChange={console.log.bind(null, 'filter')} />
      <Tabs name="courseType" tabs={tabs} onChange={console.log.bind(null, 'tabs')} />
    </List>
  );
};

ReactDOM.render(<TabsFilter />, mountNode);
```
