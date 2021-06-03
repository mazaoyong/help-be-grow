---
order: 12
title: Filter Watch处理筛选项联动
subtitle: 这将展示通过Filter的watch配置，来实现筛选项之间的联动
---

`Filter`组件配置中，能够通过配置`watch`属性来监听其他输入域的值的改动，然后通过`currContext`来修改自
身的属性，从而达到各个输入域之间联动的目的

## Watch|属性

> Watch 是一个副作用函数的集合，可以将其大概等同于 Vue 的`watch`API，通过监听不同的值来使自身发生改
> 变，但是与 Vue 的用法有一点不同，Watch 本身可以是一个函数，如果 Watch 本身是一个函数，那么所有值的
> 改变都会相应的触发 Watch 函数。

`watch`函数能够改变**_自身_**的状态，这里的状态包括以下：

```yaml
value
disabled
visible
options: 在type为Select的时候指定的参数
...inheritProps: 所有在inheritProps中指定的属性
```

- 用法 1（这种用法当只有 filedB 改变的时候会触发相应的函数）：

  ```typescript
  const sample = {
    name: 'field',
    label: 'Field:',
    type: DatePickerTypes.MonthPicker,
    watch: {
      filedB(value, currentCtx, values) {
        currentCtx.set({
          value,
        });
      },
    },
  };
  ```

* 用法 2（你可以指定多个监听的值）：

  ```typescript
  const sample = {
    name: 'field',
    label: 'Field:',
    type: DatePickerTypes.MonthPicker,
    watch: [[(value) => console.log(value), ['filedB', 'filedC']]],
  };
  ```

## 输入域自身状态

> Filter 组件中存在一个状态的集合，目前状态包括：visible 和 disabled，visible 为 false 的时候 filed
> 将不会被渲染

```typescript
interface IStatusType extends Record<string, any> {
  disabled: boolean;
  visible: boolean;
}
```

在这个例子中，当上课校区发生改变的时候，适用课程的选项也随之改变（这个改变可以是在异步函数中进行）。

```jsx
import { EasyList } from '@youzan/ebiz-components';
const { Filter } = EasyList;

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
    defaultValue: -1,
    options() {
      return getSchool();
    },
  },
  {
    name: 'class',
    label: '适用课程',
    type: 'Select',
    options: All,
    defaultValue: -1,
    watch: {
      school(value, curContext) {
        getClass(value).then((options) =>
          curContext.set({
            options: All.concat(options),
            value: -1,
          })
        );
      },
    },
  },
  {
    name: 'province',
    label: '省',
    type: 'Input',
  },
  {
    name: 'city',
    label: '市',
    type: 'Input',
    visible: false,
    watch: {
      province(value, curContext) {
        curContext.set({
          placeholder: '请填写你所在的城市',
          visible: !!value,
        });
      },
    },
  },
  {
    name: 'street',
    label: '街道',
    type: 'Input',
    visible: false,
    watch: {
      province(value, curContext) {
        const hasProvince = !!value;
        if (!hasProvince) {
          curContext.set({
            visible: false,
          });
        }
      },
      city(value, curContext) {
        const hasCity = !!value && value !== '请填写你所在的城市';
        curContext.set({
          placeholder: '你可以选填你的街道地址',
          visible: hasCity,
        });
      },
    },
  },
  [
    {
      name: 'unitPrice',
      label: '单价：',
      type: 'Input',
      defaultValue: 0,
    },
    {
      name: 'itemNumber',
      label: '数量：',
      type: 'Input',
      defaultValue: 0,
    },
    {
      name: 'totalPrice',
      label: '总价：',
      type: 'Input',
      defaultValue: 0,
      watch: [
        [
          (value, ctx, values) =>
            ctx.set({
              value: Number(values.unitPrice * values.itemNumber) || 0,
            }),
          ['itemNumber', 'unitPrice'],
        ],
      ],
    },
  ],
];

class Cascade extends React.Component {
  render() {
    return <Filter config={filterConfig} afterReset={console.log} />;
  }
}

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

function fetch(query) {
  console.log(query);
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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        dataset: list,
        pageInfo: {
          page: query.page,
          pageSize: 10,
          total: 30,
        },
      });
    }, 1000);
  });
}

ReactDOM.render(<Cascade />, mountNode);
```
