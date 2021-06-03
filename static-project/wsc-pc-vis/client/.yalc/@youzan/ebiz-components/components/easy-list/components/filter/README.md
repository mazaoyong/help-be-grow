# Filter

> 提供一个配置的方式来渲染`Filter`组件

## Overview

- Search List

  由一个`Search`搜索框和一个`List`列表组成的页面

  ![Search List](https://b.yzcdn.cn/cdn/search-list.jpg)

- Filter List

  由一个`Filter`过滤器和一个`List`列表组成的页面

  ![Filter List](https://b.yzcdn.cn/cdn/filter-list.jpg)

## API

### Filter 组件

`Filter`组件采用配置化的方式，通过指定配置项来渲染表单，内部采用`zent/form`实现数据管理，整个思路是
让使用者不需要在意数据的更新，只需要关心<u>数据输出</u>（_使用者只需要知道最终输出了哪些数据，这些数
据的值是什么，而不用关心这些值的变化会带来哪些副作用，而这些副作用的处理，会通过使用`watch`的方式进
行监听处理_）

| 属性名        | 描述                                                                                                                                 | 类型                                                                                                                         | 默认值     | 是否必填 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| config        | 用于指定渲染 Filter                                                                                                                  | [Config](#Config配置)                                                                                                        | -          | true     |
| value         | fileds 的值，只会在第一次初始化的时候使用，如果指定了相应的 config 中的 defaultValue，那么你在 value 中的值将被忽略                  | Record<strnig, any>                                                                                                          | -          | false    |
| formatFields  | 在”筛选“阶段执行，在提交 fileds 之前会触发的函数，应该返回一个对象用于更新 url                                                       | (fields: Record<string, any>): Record<string, any>                                                                           | -          | false    |
| formatQueries | 在”初始化“阶段执行，入参为 url 参数对象，应该返回一个对象用于初始化 value                                                            | (queries: Record<string, any>): Record<string, any>                                                                          | -          | false    |
| onChange      | 任意一个 field 改变的时候会触发该函数，第一个参数是个数组，数组中是一个个对象，分别有 field 的 name，value；第二个参数是所有的 value，第三个是状态的改变 | (query: {name: string, value: any}[], queryData: Record<string, any> , changedStatus: Record<string, [Status](#Status)>): void | -          | false    |
| onSubmit      | 在”筛选“阶段执行，在提交的时候执行，第一个参数是所有的 value，第二个参数是所有 field 的状态                                          | (queryData: Record<string, any>, status: Record<string, any>): void                                                          | -          | false    |
| onReset       | 在”清空筛选项“阶段执行                                                                                                               | (): void                                                                                                                     | -          | false    |
| autoFilter    | 自动提交，当 autoFilter 为 true，每次 Filter 改动都会反映到 url 上，而且不会渲染 Actions                                             | (): void                                                                                                                     | false      | false    |
| layout        | form 的布局                                                                                                                          | horizontal \| vertical                                                                                                       | horizontal | false    |
| renderActions | 用于渲染底部操作按钮的组件，如果不指定这个属性，会渲染”筛选“和”重置筛选项“两个按钮                                                   | ComponentType<{filter: [Filter](#Filter)}>                                                                                   | -          | false    |
| actionsOption | 渲染 Actions 的配置                                                                                                                  | [Option](#Action)                                                                                                            | -          | false    |

<h4 id="Config配置">Config</h4>
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

```tsx
{
  name: 'desc',
  label: '描述：',
  type: 'Custom',
  renderField: ({ value }) => <div>{value}</div>
},
```

<h5 id="ComponentType">ComponentType|默认组件类型</h5>

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
import { DatePickerTypes } from '@youzan/ebiz-easy-list';
const sample = {
  name: 'field',
  label: 'Field:',
  type: DatePickerTypes.MonthPicker
};
```

<h5 id="Watch">Watch|属性</h5>

> Watch 是一个副作用函数的集合，可以将其大概等同于 Vue 的`watch`API，通过监听不同的值来使自身发生改
> 变，但是与 Vue 的用法有一点不同，Watch 本身可以是一个函数，如果 Watch 本身是一个函数，那么所有值的
> 改变都会相应的触发 Watch 函数。

`watch`函数能够改变<u>自身</u>的状态，这里的状态包括以下：

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
          value
        });
      }
    }
  };
  ```

* 用法 2（你可以指定多个监听的值）：

  ```typescript
  const sample = {
    name: 'field',
    label: 'Field:',
    type: DatePickerTypes.MonthPicker,
    watch: [[value => console.log(value), ['filedB', 'filedC']]]
  };
  ```

#### 输入域自身状态

> Filter 组件中存在一个状态的集合，目前状态包括：visible 和 disabled，visible 为 false 的时候 filed
> 将不会被渲染

```typescript
interface IStatusType extends Record<string, any> {
  disabled: boolean;
  visible: boolean;
}
```

### Search 组件

| 属性            | 描述                     | 类型                 | 默认值 | 是否必填 |
| --------------- | ------------------------ | -------------------- | ------ | -------- |
| name            | 输入域的名字             | string               | -      | true     |
| placeholder     | 占位字符                 | string               | -      | false    |
| position        | search 所在位置          | left\|right          | right  | false    |
| onChange        | value 改变触发的函数     | (keyword: any): void | -      | false    |
| afterPressEnter | 当点击回车之后触发的函数 | (): void             | -      | false    |

### Actions 组件

> 为了方便使用，还提供了 Actions 组件，这个组件会默认渲染“筛选”和“重置筛选条件”两个按钮

| 属性        | 描述                     | 类型                     | 默认值 | 是否必填                                        |
| ----------- | ------------------------ | ------------------------ | ------ | ----------------------------------------------- |
| filter      | Filter 组件的 ref 对象   | object                   | -      | 如果是配置 actionsOption 属性，则该属性为非必填 |
| beforeReset | 渲染在重置按钮之前的节点 | ReactNode \| ReactNode[] | -      | false                                           |
| afterReset  | 渲染在重置按钮之后的节点 | ReactNode \| ReactNode[] | -      | false                                           |

#### 渲染底部操作按钮

> 同时你还能使用 renderActions 方法。renderActions 的入参包括以下三个方法，用于触发 url 更新和修改

```typescript
interface IRenderPropsType {
  submit(): void; // 提交filter数据，会触发url更新
  reset(): void; // 重设filter数据，会触发url更新
  getQueries(): Record<string, any>; // 获取当前的filter参数，不会触发url更新
  getLoading(): boolean; // 获取组件的loading状态
}
```
