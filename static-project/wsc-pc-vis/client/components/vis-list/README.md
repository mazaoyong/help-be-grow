---
- title: vis-list系列组件
- owner:
  - 逐浪
- description: vis-list系列组件
- cover: https://b.yzcdn.cn/upload_files/2020/07/09/readme/YCXBct.png
- tag:
  - vis list
---

# vis-list系列组件

> VisList系列组件包括两个大类，分别是，表格类型（VisTale, VisGrid）和表单类型（VisFilter, VisSearch），前者用于展示组件，后者用于改变筛选条件触发表格组件展示不同的数据

使用：

1. 使用[`vis-filter-table`](#filterTable)
2. 单独使用[`vis-table/vis-grid`](#visTable)
3. 单独使用[`vis-filter`](#visFilter)
4. 单独使用[`vis-search`](#visSearch)

## vis-list

> VisList用于包裹组件，并让组件能够响应浏览器地址（ReactRouter.Location: object）的变化

VisWrap组件会对其子节点注入`location`对象以及`push`方法，接下来以https://www.youzan.com/v4/vis/edu/course#/course-manage/list?courseType=2&pageNumber=1&soldStatus=2&title=%E6%B5%8B%E8%AF%95为例，分别说明`location`对象以及`push`方法

### location对象

- pathname: 保存当前的地址，在hash模式下，保存的是`#`之后的地址，在这个例子中就是： `/course-manage/list`，而真实的location对象的pathname则是： `/v4/vis/edu/course`
- search: 保存的是包括`?`在内的当前地址的查询字符串
- query: 保存的是查询字符串格式化之后的对象
- state: -

### push方法

push方法一个对象类型的参数，包括pathname和search属性

#### example

```javascript
push({
    pathname: string,
    search: object,
})
// example
// source location: https://youzan.com/v4/edu/course#/course-
// manage/list
push({
   pathname: '/course-manage/list', // 一般来说会去location对象中取
    search: {
        title: '测试',
        courseType: 2,
        soldStatus: 2,
    }
})
// redirect location: https://www.youzan.com/v4/vis/edu/course
// #/course-manage/list?courseType=2&soldStatus=2&title=测试
```

#### demo

1. 使用`VisList`包裹组件
```jsx
import VisList, { VisFilterTable } from 'component/vis-list';
...
renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
        <>
        <Button type="primary" onClick={submit}>
            筛选
        </Button>
        <span className="filter__actions__reset" onClick={reset}>
            重置筛选条件
        </span>
        </>
    );
};
...
<VisList>
  <VisFilterTable
    filterProps={{
      defaultValue,
      options,
      bottomActions: this.renderBottomAction,
    }}
    tableProps={{
      ref: table => (this.VisTable = table),
      rowKey: 'alias',
      columns: columns(this),
      emptyLabel: this.tablePlaceholder(),
      batchComponents: this.batchComponents,
      initQueries: defaultValue,
      selectable: true,
      fetchData: this.fetchData,
      onSelect: this.handleTableSelected,
    }}
  />
</VisList>
```

- ![头部效果](https://img.yzcdn.cn/public_files/2018/12/28/b2e3da15394210dbb780fca346491a80.png)
- ![底部效果](https://img.yzcdn.cn/public_files/2018/12/28/0b111ce729c406097d247d1734ec1d8f.png)
- ![分页功能](https://img.yzcdn.cn/public_files/2018/12/28/42db885bde005e6a7fab56192d6ee943.png)
- ![排序功能](https://img.yzcdn.cn/public_files/2018/12/28/ca851b1da6fb4baef881ac17785bdd13.png)
- ![筛选联动](https://b.yzcdn.cn/public_files/2018/12/28/b9c50fb66f37527bfdece865d20f9f04.png)
- ![选择功能](https://img.yzcdn.cn/public_files/2018/12/28/288a1313d46f9c650735321f01fa1811.png)
2. 如果没有使用`VisList`进行包裹，则使用更改`VisTable`的`zanQuery`属性来触发表格更新

## <span id="#filterTable">vis-filter-table</span>

> VisFilterTable是VisFilter和VisTable的封装，组件唯一修改的地方是将VisFilter和VisTable的onChange事件整合到一个onChange事件，方便同一个地方进行调用

| 属性        | 描述                                             | 类型                                         | 默认值     | 可选值   |
| ----------- | ------------------------------------------------ | -------------------------------------------- | ---------- | -------- |
| onChange    | 表格和筛选组件的onChange事件都会统一触发这个事件 | (params:{tableChange, filterChange}) => void | () => void | function |
| filterProps | 见 [vis-filter配置](#filterApi)                  | object                                       | -          | -        |
| tableProps  | 见 [vis-table配置](#tableApi)                    | object                                       | -          | -        |



## <span id="visTable">vis-table/vis-grid</span>

> VisTable和VisGrid组件通过传入featchData参数来获取数据，并且在组件内部维护分页状态以及选择操作选中的数据列表

### columns: ITableColumn[]

> 必填

与zent/table的columns配置一致

### fetchData: Promise

> 必填

这个属性在获取数据的时候被调用，获取数据只会发生在两个生命周期中：

1. componentDidMount：在组件装载的时候会带着`initQueries`属性进行数据请求，并将响应的数据展现在VisTable/Grid中
2. componentDidUpdate：在浏览器地址发生变化的时候进行判断，并在合适的时候发起请求的时候会调用`featchData.url`

这个属性能够接受两种类型的值，一种是`string`类型，用于表示发起请求的目标地址；第二种是一个数组，数组的第一个值是`resful methods`，第二个值是发起请求的目标地址。

#### example

```javascript
// fetchData={['GET', '/v4/vis/edu/getCourseList.json']}
fetchData="/v4/vis/edu/getCourseList.json"
```

### initQueries: object

> 选填

在很多的场景下，在查询首页信息的时候一般会带上些许默认参数用于获取首页表格数据，在必要的时候，将这些数据放入`initQueries`属性，在组件首次请求的时候会带上这个参数进行请求。

### **zanQueries: object**

> 选填
>
> 如果不使用vis-list组件包裹filter-table类型的组件的时候，能够通过改变这个值来让组件调用fetchData方法
> vis-filter-table内部也是通过改变这个属性值来让table发起一次数据更新

这个属性会以较高的优先级被组件使用做查询参数，**如果想要通过传入query触发表单的更新**，请指定这个参数。

在组件发起请求的时候请求格式大致如下：

```javascript
zanQueries -change-> next zanQueries
fetchData({zanQueries, otherQueries})
```

### onDataChange()

> 选填
>
> (datasets: any[]) => void

这个方法会在每次获取数据成功的时候触发，入参为新的数据。

### pageConfig:  IPageableProperty](#ipageablePorperty)

> 选填

控制是否显示分页器，默认为显示，还可以传入一个对象，这个对象会在组件装载的生命周期中与可能存在的初始化查询条件(initQueries)合并以查询对应的列表数据。

### selectable: false | [ISelectableProerty](#iSelectableProperty)

> 选填

控制是否显示每一行的选择按钮，同时这个属性也接受一个参数，参数配置信息见参数列表。

该属性会透传给`zent/table`的`selection`属性；虽说是透传，但是会将`selectedRowKeys`用`rowKey`属性来代替，`onSelect`事件也会被组件内部的`this.onSelect`事件重写，该对象的`onSelect`属性则会被忽略。

**需要注意的一点是，由于VisGrid组件的batchComponents属性是通过一个高阶函数包裹而支持的，所以不建议将跨页操作配置置为可用**

### onSelect()

> 选填
>
> (selectedRow: any[], datasets: any[]) => void

当VisTable/Grid属性为`true`或者是一个配置对象的时候，当表单的某一行被选中的时候会触发这个函数，入参是当前选中的所有行以及所有的数据。

### batchComponents: array [ html/function/React Component ]

> 选填
>
> 同时batchComponentsAutoFixed属性默认值为true

需要特别说明的是，在VisGrid中，通过再封装使其也具备了`batchComponents`属性，使用方法与`zent/table`一致，但是，正如`selectable`属性中指出的，该属性在VisGrid中不支持跨页选择操作。

### <span id="tableApi">API</span>

| 属性                | 描述                                                         | 类型                                                         | 默认值 | 可选值          |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------ | --------------- |
| ...zent/table props | `zent/table`的属性都能使用                                   | ReactHtmlAttribute                                           | -      | -               |
| columns             | -                                                            | function/object                                              | 必填   | -               |
| fetchData           | 用于请求表单数据                                             | string \| [[Methods](#methods), string]                      | 必填   | -               |
| initQueries         | 请求默认会带上的参数，可能存在业务场景需要存在默认参数，这时候就需要这个了 | object                                                       | -      | -               |
| formatReq           | 格式化请求参数对象                                           | (params: { filterConditions: [object](#filterConditions), pageConditions:  [IPageRequest](#pageConditions) }) => any | -      | -               |
| formatRes           | 格式化返回的数据，需要有些必要的字段                         | (data: object) => { datasets: any[], total: number, current?: number } | -      | -               |
| zanQueries          | 见例子                                                       | object                                                       | -      | -               |
| onDataChange        | 当table的datasets改变的时候触发这个钩子                      | (data) => void                                               | -      | -               |
| pageConfig          | 是否开启分页，可以传递一个对象指定默认页数                   | [IPageableProperty](#ipageablePorperty)                      | true   | boolean\|object |
| selectable          | 是否开启选择，可以传递一个对象指定除了onSelect之外的所有selection参数 | boolean                                                      | false  | true\|object    |
| onSelect            | 当选中的时候触发的钩子函数                                   | (selectedRow: any[], datasets: any[]) => void                | -      | -               |
| batchComponents     | 因为grid组件不支持该属性，所以在vis-grid组件做了一个再封装，使api统一 | -                                                            | -      | -               |



### 其他方法

#### refetchData

> 该属性具有loading以及refresh属性，前者用于触发表格的loading状态，后者用于主动触发表格更新数据

这个方法一般用于，当批量操作导致表格中的数据发生改变，而因为批量操作是不受VisList组件控制，所以就需要手动触发表格的loading以及数据的更新。

```javascript
// 使表格进度loading装填
this.refEle.refetchData.loading();
// 重新获取数据
someAction().then(() => this.refElement.refetchData.refresh());
```

## <span id="visFilter">vis-filter</span>

> VisFilter组件通过配置项来渲染出筛选表单，需要外部指定触发Submit的按钮

### options: FilterOptions

> 必填

options属性用于指定组件应该渲染的子组件，具体配置方法如下：

```typescript
type FilterOptions = IFilterOptsItem[] | null;
type FilterOptsTypes =
	'Select' | 'Input' | 'Checkbox' | 'DateRangePicker' | 'DateRangeQuickPicker' | 'Custom';
interface IFilterOptsItem {
  type: FilterOptsTypes;
  name: string;
  label: string;
  data?: [{
    value: any;
    text: string;
  }];
  props?: object;
}
```

Custom 类型的子组件可以传入 component 和 format，component 是一个有着 value 和 onChange 的 props 的
自定义组件，format 是一个返回值为 Promise 的函数，帮助自定义组件的 onChange 事件处理冒泡数据；返回的 Promise
所 reslove 的值只能是你希望 Filter 接受的数据。

#### example

```javascript
[
    {
       type: 'select',
       name: 'status',
       label: '售卖状态：',
       data: [{
           value: '0',
           text: '全部'
         }, {
           value: '1',
           text: '更新中'
         }, {
           value: '2',
           text: '停止更新'
         }],
       props: {
         placeholder: '全部'
       }
    }, {
       type: 'input',
       name: 'keyword',
       label: '专栏名称：',
    }
]
```

只有type为Select的时候，需要指定data来渲染选项。

### defaultValue: IFilterValueOrHides

> 选填
>
> 如果没有指定这个值，默认会使用options的name - value值聚合的对象作为这个值的默认值，Select类型的会使用data的第一个值的value属性的值作为这个属性的默认值

defaultValue用于指定相应的name组件的默认值

```typescript
interface IFilterValueOrHides {
  [key: string]: any;
}
```

### hides: IFilterValueOrHides

> 选填

用于控制指定的name组件是否显示

#### example

```javascript
{
	keyword: true
}
```

### onChange()

> 选填

会将所有的[name]: value放入一个对象中，作为入参传入该方法，该方法会在VisFilter其中任意一个组件发生change事件的时候调用。

### bottomActions()

> 选填
>
> (filter: [IFilterMethod](#iFilterMethod)) => ReactNode | ReactNode[]

这个属性一般用作渲染提交以及重置按钮，通过入参`filter`中的属性来配合完成一系列功能。

1. 如果组件被VisWrap包裹，`filter.submit`会将filter的改变相对应的映射到浏览器的地址中，值得注意的是，**每次这个操作都会使pageNumber属性置为1（透过push)**。

2. `filter.reset`这个方法，仅仅是将组件内部的value置为初始值，而不修改浏览器地址。

#### example

```jsx
renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
        <>
        	<Button type="primary" onClick={submit}>
        		筛选
        	</Button>
        	<span className="filter__actions__reset" onClick={reset}>
            	重置筛选条件
        	</span>
        </>
	);
};
```

### <span id="filterApi">API</span>

| 属性          | 描述                                 | 类型                    | 默认值 | 可选值 |
| ------------- | ------------------------------------ | ----------------------- | ------ | ------ |
| options       | 需要渲染的筛选组件                   | FilterOptions           | 必填   | -      |
| defaultValue  | 各个筛选组件的默认值                 | IFilterValueOrHides     | -      | -      |
| hides         | 控制各个筛选组件是否隐藏             | IFilterValueOrHides     | -      | -      |
| onChange      | 当筛选条件发生变化的时候触发该钩子   | (value: obejct) => void | -      | -      |
| bottomActions | 通过该属性渲染`提交`和`重置`功能按钮 | (filter) => ReactNode   | -      | -      |
| onSubmit      | 提交的时候触发                       | (value: object) => void | -      | -      |



## <span id="#visSearch">vis-search</span>

vis-search默认绑定键盘回车事件，当组件被vis-wrap包裹的时候，确认操作（回车/点击搜索图标）都会将key-value反射到浏览器地址中。

### name: string

> 必填

name属性用于指定vis-search的字段名

### onChange()

> 选填
>
> (value: object, e: Event) => void

当输入时会触发该事件，第一个参数是组件的值的key-value对象。

### onSubmit()

> 选填
>
> (value: object) => void

当提交的时候触发该函数。

### addonQuery: object

> 选填

额外的查询条件，每次submit操作，都会将这个对象和输入框key-value作为查询参数触发浏览器地址的变换。

### <span id="searchApi">API</span>

| 属性       | 描述                                   | 类型                    | 默认值 | 可选值 |
| ---------- | -------------------------------------- | ----------------------- | ------ | ------ |
| name       | 字段名                                 | string                  | 必填   | -      |
| onChange   | 输入的时候触发                         | ()                      | -      | -      |
| onSubmit   | 提交的时候触发                         | (value: object) => void | -      | -      |
| addonQuery | 会让筛选条件的聚合对象带上这个属性的值 | object                  | -      | -      |

## 通用方法

### formatFilterOpts()

用于格式化传入的filter.options等对象，返回options, values两个对象，如果这个方法的参数是一个数组，那么返回的value对象是数组中的每一项的data的第一个value（Select），如果options中不存在任何一个Select类型，那么value会是一个空对象。

### formatQueries()

用于格式化查询参数，一般在内部调用，这个函数会将传入的参数格式化，返回filterConditions和pageConditions两个对象，会对sortBy参数进行一个字符串映射。

## 类型注释

<span id="methods">Methods:  GET, POST, PUT, DELETE. OPTIONS</span>

<span id="filterConditions">filterConditions: 所有的查询参数都会被放入这个对象中</span>

<span id="pageConditions">pageConditions: 后端dubbo接口的pageRequest对象 </span>

```typescript
interface pageRequest {
  pageNumber: number;
  pageSize?: number;
  sort?: IPageRequestSortType;
  total?: number;
}
```

<span id="ipageablePorperty">IPageableProperty：是一个对象，其形式如zent/table的pageInfo</span>

```typescript
interface IPageableProperty {
  current: number;
  limit?: number;
  pageSize?: number;
  total?: number;
  pageSzieOptions?: number[];
}
```

<span id="iSelectableProperty">ISelectableProerty：是一个对象，具体配置可以见，[zent/table selection](https://youzan.github.io/zent/zh/component/table#selection)</span>

```typescript
interface ISelectableProperty {
  needCrossPage: boolean;
  isSingleSelection: boolean;
}
```

<span id="iFilterMethod">IFilterMethod：这个对象内部包括了VisFilter组件内所有筛选表单组件的键值对组成的对象以及一个submit方法用于主动触发表单提交事件以及一个reset方法用于重置表单的值为defaultValue</span>

```typescript
interface IFilterMethod {
  data: any;
  // 该方法用于提交filter数据
  submit(): void;
  // 用于重置filter数据
  reset(): void;
}
```


## Changelog

- `2020-03-09` `pageConfig` 支持 `pageSizeOptions` 选项来开启修改分页大小
- `2020-03-17` 分页器和批量操作使用grid原生实现
