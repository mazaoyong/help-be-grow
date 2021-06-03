---
order: 10
title: 使用Search组件渲染搜索框
subtitle: 渲染一个带有搜索框的筛选列表
---

使用`Search`组件，渲染一个带有输入框的筛选列表。

```jsx
import { Button } from 'zent';
import { EasyList, Select } from '@youzan/ebiz-components';
const { List, Search, EasyGrid, Filter, InlineFilter } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true },
  { title: '发布时间', name: 'publishTime', needSort: true },
];

const config = [
  {
    name: 'gender',
    type: 'Select',
    options: [
      { text: '男', value: '1' },
      { text: '女', value: '0' },
    ],
  },
];

const SearchList = () => {
  const fetch = (query) => {
    console.log('fetch', query);
    const list = [];
    for (let i = 0; i < query.pageSize; i++) {
      list.push({
        id: i,
        title: `标题${i}`,
        updatedAt: '2019-04-07',
        operatorName: `修改人${i}`,
        publishTime: '2019-04-07',
      });
    }
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            dataset: list,
            pageInfo: {
              page: 1,
              pageSize: query.pageSize,
              total: 30,
            },
          }),
        1500
      );
    });
  };

  return (
    <List delay={200} mode="hash" onSubmit={fetch}>
      <Search name="queryRight" />
      <Search name="queryLeft" position="left">
        <Button>我是右边的按钮</Button>
      </Search>
      <InlineFilter
        left={<Button type="primary">添加选项</Button>}
        right={[
          <Filter key="filter" config={config} backgroundColor="transparent" autoFilter />,
          <Search key="search" name="inlineSearch" />,
        ]}
      />
      <EasyGrid columns={columns} />
    </List>
  );
};

ReactDOM.render(<SearchList />, mountNode);
```
