---
category: 组件
type: 数据
title: 筛选列表
subtitle: EasyList
description: 通过配置渲染一个筛选列表组件，同时这个组件能够响应URL参数的变化
---

## List

| 参数             | 说明                                                               | 类型                   | 必填 | 默认值           |
| ---------------- | ------------------------------------------------------------------ | ---------------------- | ---- | ---------------- |
| onSubmit         | 列表拉取接口                                                       | FetchFn                | 是   | 无               |
| mode             | 路由模式                                                           | IHistoryMode           | 否   | browser          |
| defaultFilter    | 默认请求参数                                                       | IDefaultFilter         | 否   | { pageSize: 20 } |
| delay            | 可以指定延迟多久进行数据请求                                       | number                 | 否   | -                |
| fetchInInit      | 是否在组件初始化完成就进行数据请求                                 | boolean                | 否   | true             |
| filterNormalizer | 更新 filter 的时候会触发这个方法，返回一个对象用于更新 filter 的值 | `(filter: any) => any` | 否   | -                |
| onError          | 获取列表失败执行的回调函数                                         | (err: Error) => void   | 否   | -                |

#### FetchFn 类型

```typescript
interface IFilter {
  /* 分页大小 */
  pageSize: number;
  [propName: string]: any;
}

interface IGlobalState {
  [propName: string]: any;
}

interface IRequestParams extends IFilter {
  /* 当前页码 */
  page: number;
}

interface IFormatData {
  /* 分页对象 */
  pageInfo: IPageInfo;
  /* 数据 */
  dataset: any[];
}

interface IPageInfo {
  /* 当前页码 */
  page: number;
  /* 分页大小 */
  pageSize?: number;
  /* 总数 */
  total: number;
}

type FetchFn = (state: IRequestParams, globalState: IGlobalState) => Promise<IFormatData>;
```

#### IHistoryMode 类型

```typescript
// hash 哈希路由
// browser html5路由
// none 无路由
type IHistoryMode = 'hash' | 'browser' | 'none';
```

#### IDefaultFilter

```typescript
interface IDefaultFilter {
  /* 分页大小 */
  pageSize?: number;
  /* 排序方式 */
  sortType?: string;
  /* 排序字段 */
  sortBy?: string;
  [propName: string]: any;
}
```

## Filter

> 提供一个配置的方式来渲染`Filter`组件

`Filter`组件采用配置化的方式，通过指定配置项来渲染表单

| 属性名                | 描述                                                                                                                                 | 类型                                                                                                                  | 默认值             | 是否必填 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- | ----- |
| config                | 用于指定渲染 Filter                                                                                                                  | `Array[]`                                                                                                             | -                  | true     |
| value                 | fileds 的值，只会在第一次初始化的时候使用，如果指定了相应的 config 中的 defaultValue，那么你在 value 中的值将被忽略                  | `Record<strnig, any>`                                                                                                 | -                  | false    |
| formatQueries         | 在”初始化“阶段执行，入参为 url 参数对象，应该返回一个对象用于初始化 value                                                            | (queries: `Record<string, any>`): `Record<string, any>`                                                               | -                  | false    |
| formatFields          | 在”筛选“阶段执行，在提交 fileds 之前会触发的函数，应该返回一个对象用于更新 url                                                       | (fields: `Record<string, any>`): `Record<string, any>`                                                                | -                  | false    |
| onChange              | 任意一个 field 改变的时候会触发该函数，第一个参数是个对象，分别有 field 的 name，value；第二个参数是所有的 value，第三个是状态的改变 | (query: {name: string, value: any}, queryData: `Record<string, any>` , changedStatus: `Record<string, Status>`): void | -                  | false    |
| onSubmit              | 在”筛选“阶段执行，在提交的时候执行，第一个参数是所有的 value，第二个参数是所有 field 的状态                                          | (queryData: `Record<string, any>`, status: `Record<string, any>`): void                                               | -                  | false    |
| onReset               | 在”清空筛选项“阶段执行                                                                                                               | (): void                                                                                                              | -                  | false    |
| autoFilter            | 自动提交，当 autoFilter 为 true，每次 Filter 改动都会反映到 url 上，而且不会渲染 Actions                                             | (): void                                                                                                              | false              | false    |
| layout                | form 的布局                                                                                                                          | horizontal \| vertical                                                                                                | horizontal         | false    |
| renderActions         | 用于渲染底部操作按钮的组件，如果不指定这个属性，会渲染”筛选“和”重置筛选项“两个按钮                                                   | `ComponentType<{filter: Filter}>`                                                                                     | -                  | false    |
| actionsOption         | 渲染 Actions 的配置                                                                                                                  | 见 Action 组件的配置                                                                                                  | -                  | false    |
| collapseConfig        | 设置折叠显示的筛选项                                                                                                                 | 类型定义同`config`属性                                                                                                | -                  | false    |
| collapseSwitcherLabel | 折叠开关的文案，前者为展开状态提示，后者为缩起状态提示                                                                               | `[string, string]`                                                                                                    | `['收起', '展开']` | false    |
| defaultCollapseState  | 默认折叠状态                                                                                                                         | `expand                                                                                                               | collapse`          | `expand` | false |

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

| 属性        | 描述                        | 类型                     | 默认值 | 是否必填                                                     |
| ----------- | --------------------------- | ------------------------ | ------ | ------------------------------------------------------------ |
| filter      | Filter 组件的 ref 对象      | object                   | -      | 在单独调用 Action 组件的时候，需要传递 Filter 的 filter 对象 |
| isLink      | 重置按钮的标签是否为 a 标签 | boolean                  | false  | false                                                        |
| beforeReset | 渲染在重置按钮之前的节点    | ReactNode \| ReactNode[] | -      | false                                                        |
| afterReset  | 渲染在重置按钮之后的节点    | ReactNode \| ReactNode[] | -      | false                                                        |

## EasyGrid

| 参数                     | 说明                                               | 类型      | 默认值     | 是否必须 |
| ------------------------ | -------------------------------------------------- | --------- | ---------- | -------- |
| columns                  | 表格列配置                                         | array     |            | 是       |
| easySelection            | 简单版表格的选择功能配置                           | bool      |            | 否       |
| selection                | 表格的选择功能配置                                 | object    |            | 否       |
| pageSizeOptions          | 分页选项                                           | number[]  |            | 否       |
| pageable                 | 是否展示分页                                       | boolean   |            | 否       |
| emptyCreateLabel         | 是否在空列表的时候展示创建文案                     | ReactNode |            | 否       |
| customColumns            | 是否允许自定义表头                                 | boolean   | false      | 否       |
| customColumnsCacheKey    | 允许指定自定义表头缓存的 key，如果不指定则自动生成 | string    |            | 否       |
| customColumnsTriggerText | 设置触发设置自定义表头弹窗按钮的文案               | string    | 配置表头   | 否       |
| customColumnsDialogTitle | 自定义表头弹窗的标题                               | string    | 自定义表头 | 否       |

### columns

基于 zent grid columns 新增以下属性：

| 参数            | 说明                                             | 类型      | 是否必须 |
| --------------- | ------------------------------------------------ | --------- | -------- | --- |
| headerHelp      | 列表头帮助信息                                   | ReactNode | 否       |
| helpPopPosition | 列表头帮助信息 pop 位置                          | string    | 否       |
| altTitle        | `title`的备用字段，在`title`不为字符串时可以设置 | string    |          | 否  |
| forbidCustom    | 控制当前列是否参与自定义                         | boolean   | false    | 否  |

### selection

| 参数             | 说明                                                                                 | 类型                                                                                  | 是否必须 |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------- |
| onSelect         | 每次 check 的时候触发的函数,bool 为 true 会同步更新 selectedkeys，false 不会同步更新 | (selectedkeys: string[], selectedRows: `Array<any>`, changeRow: any \| any[]) => bool | 否       |
| getCheckboxProps | 选择框属性配置 (当前仅支持 disabled)                                                 | (data: object) => { disabled?: boolean }                                              | 否       |
| selectedRowKeys  | 默认选中的行                                                                         | string[]                                                                              | 否       |
