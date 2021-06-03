---
order: 15
title: Filter基础用法
subtitle: 下面是Filter所有组件的config例子
---

> 你可以尝试修改下面的选项然后重新刷新页面

## Config

> Config是整个Filter组件的重要部分，也是唯一的必填属性，可以通过指定Config，来实现想要的布局方式和联动效果

最小配置：

```typescript
const minimumConfig = {
  name: 'field',
  label: 'Filed:',
  type: 'Input'
  // defaultValue: 'Youzan',
};
```

| 属性         | 描述                                                          | 类型                                                       | 默认值 | 是否必填 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ | -------- |
| name         | 输入域的 key                                                  | string                                                     | -      | true     |
| label        | 输入域的标签                                                  | ReactNode                                                  | -      | true     |
| type         | 组件类型                                                      | [ComponentType](#ComponentType)                            | -      | true     |
| defaultValue | 默认值，优先级要高于 Filter 的 value                          | any                                                        | -      | false    |
| format       | 新版 form 引入了 format 函数                                  | boolean                                                    | true   | false    |
| disabled     | 是否禁用当前输入域（需要组件支持）                            | boolean                                                    | false  | false    |
| watch        | 监听其他输入域改变，从而改变自身的一些状态和属性              | [Watch](#Watch)                                            | false  | false    |
| inheritProps | 透传到组件的属性                                              | Omit<ComponentProps, 'value' \| 'defaultValue'>            | false  | false    |
| options      | 如果 type 为 Select，Checkbox 以及 Radio 时，需要填写这个属性 | Array<{ text: string, value: string; disabled?: boolean }> | -      | true     |
| renderFiled  | 如果 type 为 Custom 时，需要填写这个属性                      | FC<{ value: any } & Record<string, any>>                   | -      | true     |

> EasyList 的 Filter 组件提供一个 config 参数，允许使用者使用配置的方式来方便快速的创建一个 Filter
> 输入域

Filter 主要提供了 Input, TimePicker, Select 等类型，如果提供的默认类型不满足需求，也可以使用用户自己
的组件

```typescript
{
  name: 'desc',
  label: '描述：',
  type: 'Custom',
  renderField: ({ value }) => <div>{value}</div>
},
```

### ComponentType|默认组件类型

> 组件类型，`Filter`提供了一些组件类型，用于渲染

```typescript
type ReservedType =
  | 'Input'
  | 'Select'
  | 'Checkbox'
  | 'Radio'
  | DatePicker
  | 'DateRangeQuickPicker'
  | 'Custom';
type DatePicker =
  | 'DatePicker'
  | 'QuarterPicker'
  | 'MonthPicker'
  | 'WeekPicker'
  | 'DateRangePicker'
  | 'TimePicker'
  | 'TimeRangePicker';
```

**Tips:**

在使用`DatePicker`类型的时候，可以通过引用内部的`DatePickerTypes`这个枚举类型来声明`config.type`，使
用方法如下：

```typescript
import { EasyList } from '@youzan/ebiz-components';
const { DatePickerTypes } = EasyList;
const sample = {
  name: 'field',
  label: 'Field:',
  type: DatePickerTypes.MonthPicker
};
```

```jsx
import { EasyList, Select } from '@youzan/ebiz-components';
import { Button } from 'zent';
const { List, Filter, DatePickerTypes } = EasyList;

const fetchOptions = (query, pageRequest) => {
  console.log('fetch options:[', query, ']');
  const options = '1234567890abcdefgh'.split('').map((_, index) => {
    return {
      text: `${query} 选项 ${index} 第${pageRequest.current}页`,
      value: `${query} 选项 ${index} 第${pageRequest.current}页`,
      disabled: index % 2 === 1
    };
  });

  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          options,
          pageInfo: {
            current: pageRequest.current,
            total: 72
          }
        }),
      200
    )
  );
};

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true },
  { title: '发布时间', name: 'publishTime', needSort: true }
];

const BASE_OPTIONS = [
  { text: '选项1', value: '0' },
  { text: '选项2', value: '1' },
  { text: '选项3', value: '2' }
];

const getFilterConfig = toggleVisible => [
  {
    name: 'input',
    label: '输入框：',
    type: 'Input',
    inheritProps: {
      placeholder: '请输入你想输入的文案'
    }
  },
  {
    name: 'select',
    label: '选择类型：',
    type: 'Select',
    options: BASE_OPTIONS,
    inheritProps: {
      placeholder: '请选择你想要的选项'
    }
  },
  {
    name: 'checkbox',
    label: '多选类型：',
    type: 'Checkbox',
    defaultValue: ['pineapple'],
    options: [
      { text: '凤梨', value: 'pineapple' },
      { text: '苹果', value: 'apple' },
      { text: '橘子', value: 'orange' },
      { text: '榴莲', value: 'durian', disabled: true }
    ]
  },
  {
    name: 'radio',
    label: '单选类型：',
    type: 'Radio',
    options: [
      { text: '男', value: '1' },
      { text: '女', value: '0' }
    ]
  },
  {
    name: 'dateRangeQuickPicker',
    label: '快速时间范围：',
    type: DatePickerTypes.DateRangeQuickPicker,
    inheritProps: {
      canClear: false
    }
  },
  [
    {
      name: 'desc',
      label: '描述：',
      type: 'Custom',
      renderField: Select,
      inheritProps: {
        filter: true,
        tags: true,
        mode: 'async',
        maxSize: 5,
        fetchOnMounted: true,
        fetchOptions,
        onSelect(val, items) {
          console.log('selected:', val, items);
        }
      }
    }
  ],
  {
    name: 'rangePicker',
    label: '选择时间范围：',
    type: DatePickerTypes.DateRangePicker,
    defaultValue: ['2020-02-03', '2020-03-22']
  },
  {
    name: 'monthPicker',
    label: '选择月：',
    type: DatePickerTypes.MonthPicker
  },
  {
    name: 'quarterPicker',
    label: '选择年：',
    type: DatePickerTypes.QuarterPicker,
  },
  {
    name: 'toggleVisible',
    label: '动态显示：',
    type: 'Input',
    visible: toggleVisible,
    watch: {
      input(value, ctx) {
        ctx.set({ value, visible: !!value });
      }
    }
  },
];

const NormalComponents = () => {
  const [visibleState, toggleVisible] = React.useState(true);

  const fetch = React.useCallback((args) => {
    console.log('submit:', args);
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        id: i,
        title: `标题${i}`,
        updatedAt: '2019-04-07',
        operatorName: `修改人${i}`,
        publishTime: '2019-04-07'
      });
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          dataset: list,
          pageInfo: {
            page: 1,
            pageSize: 10,
            total: 30
          }
        })
      }, 2000);
    });
  }, []);

  const currentConfig = React.useMemo(() => getFilterConfig(visibleState), [visibleState]);

  return (
    <List onSubmit={fetch}>
      <Filter
        config={currentConfig}
        actionsOption={{
          afterReset: <Button onClick={() => toggleVisible(prev => !prev)}>{visibleState ? '隐藏动态显示' : '显示动态显示'}</Button>
        }}
      />
    </List>
  );
}

ReactDOM.render(<NormalComponents />, mountNode);
```
