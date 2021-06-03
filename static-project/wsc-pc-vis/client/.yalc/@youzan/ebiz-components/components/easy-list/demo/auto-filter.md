---
order: 13
title: Filter变化自动提交
subtitle: 当筛选项改变的时候自动触发筛选函数，更新列表
---

> 通过申明`autoFilter`属性，能够让`EasyList`在筛选条件发生改变的时候触发获取列表

```jsx
import { EasyList } from '@youzan/ebiz-components';
const { List, Filter, EasyGrid } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true },
  { title: '发布时间', name: 'publishTime', needSort: true },
];
const All = [{ text: '全部', value: -1 }];

const filterConfig = [
  {
    name: 'school',
    label: '上课校区',
    type: 'Select',
    defaultValue: 1,
    options() {
      return getSchool();
    },
  },
  {
    name: 'class',
    label: '适用课程',
    type: 'Select',
    options: All,
    watch: {
      school(value, currContext) {
        getClass(value).then((options) =>
          currContext.set({
            options: All.concat(options),
            value: -1,
          })
        );
      },
    },
  },
];

const AutoFilter = () => {
  const fetch = React.useCallback((args) => {
    console.log('submit:', args);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dataset: [],
          pageInfo: {
            page: 1,
            pageSize: 10,
            total: 30,
          },
        });
      }, 2000);
    });
  }, []);

  return (
    <List onSubmit={fetch}>
      <Filter config={filterConfig} autoFilter />
    </List>
  );
};

function getSchool() {
  const data = [
    { text: '全部', value: -1 },
    { text: '玉泉校区', value: 1 },
    { text: '西溪校区', value: 2 },
    { text: '之江校区', value: 3 },
    { text: '紫金港校区', value: 4 },
  ];
  return Promise.resolve(data);
}

function getClass(school) {
  const schoolClass = {
    1: [
      { text: 'C++高级程序设计', value: 1 },
      { text: 'Java指南', value: 2 },
    ],
    2: [
      { text: '图形学', value: 3 },
      { text: '数据结构', value: 4 },
    ],
    3: [
      { text: '数字逻辑', value: 5 },
      { text: '操作系统', value: 6 },
    ],
    4: [
      { text: '计算机体系结构', value: 7 },
      { text: '汇编语言', value: 8 },
    ],
  };
  let currentClass;
  if (school == -1) {
    currentClass = Array.prototype.concat.apply(
      [],
      Object.keys(schoolClass).map((k) => schoolClass[k])
    );
  } else {
    currentClass = schoolClass[school] || [];
  }
  return Promise.resolve(currentClass);
}

ReactDOM.render(<AutoFilter />, mountNode);
```
