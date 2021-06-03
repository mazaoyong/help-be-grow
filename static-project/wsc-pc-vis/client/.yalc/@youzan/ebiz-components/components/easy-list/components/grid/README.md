# EasyGrid 组件

> EasyList 的内置 Grid 组件，内置封装了 pageInfo,sort,onChange,datasets,loading 相关行为

## 与 zent grid 使用区别

### selection

和正常使用 zent grid 唯一区别在于 EasyGrid 提供了 easySelection 配置项，简化了 grid selection 相关配
置。

```js
<EasyGrid columns={getColumns()} easySelection batchRender={(data) => <Customer data={data} />} />
```

等同于

```js
<Grid
  columns={getColumns()}
  selection={{
    selectedRowKeys: this.state.selectedRowKeys,
    onSelect: (selectedRowKeys, selectedRows, currentRow) => {
      this.setState({
        selectedRowKeys,
      });
    },
  }}
/>
```

easySelection 配置项内部只处理了最简单常见选择更新操作，如果在 onSelect 内部有特定逻辑处理，需要
onSelect 返回一个 Boolean 值。

true: 更新当前选择项 false: 不更新当前选择项

```js
<EasyGrid
  columns={getColumns()}
  selection={{
    onSelect: (selectedRowKeys, selectedRows, currentRow) => {
      if (selectedRowKeys.length > 2) {
        Notify.error('你最多选择两个');
        return false;
      }
      return true;
    },
    getCheckboxProps: (data) => ({
      disabled: data.name === '母婴商品 1',
    }),
  }}
/>
```

### pageSizeOptions

pageInfo 中的 pageSizeOptions 属性，需要直接传入到 EasyGrid。

## API

内部维护了 zent grid 的以下属性：
`columns, datasets, onChange, selection, pageInfo, sortType, sortBy`

需要设置初始化 sortType, sortBy, pageSize 可以通过设置 List props 中的 defaultFilter。

其他 api 均与[zent grid](http://fedoc.qima-inc.com/zent/zh/component/grid)一致。

| 参数            | 说明                                                       | 类型                 | 默认值 | 是否必须 |
| --------------- | ---------------------------------------------------------- | -------------------- | ------ | -------- |
| columns         | 表格列配置                                                 | array                |        | 是       |
| easySelection   | 简单版表格的选择功能配置                                   | bool                 |        | 否       |
| selection       | 表格的选择功能配置                                         | object               |        | 否       |
| pageSizeOptions | 分页选项                                                   | number[]             |        | 否       |
| pageable        | 是否展示分页器                                             | boolean              | true   | 否       |
| formatter       | 当没有定义 bodyRender 方法的时候，定义该方法用于格式化数据 | `(data: any) => any` | false  | 否       |

### columns

基于 zent grid columns 新增以下属性：

| 参数            | 说明                                                                         | 类型      | 是否必须 |
| --------------- | ---------------------------------------------------------------------------- | --------- | -------- |
| name            | 字段名，支持属性运算符，即 `.` 运算                                          | string    |          | 是 |
| headerHelp      | 列表头帮助信息                                                               | ReactNode |          | 否 |
| helpPopPosition | 列表头帮助信息 pop 位置                                                      | string    | 否       |
| altTitle        | 配合自定义表头使用，如果 title 为 ReactNode，可以使用替代 title 在弹窗中展示 | string    | 否       |
| forbidCustom    | 配合自定义表头使用，设置之后该列不允许被配置                                 | boolean   | 否       |
| helpPopPosition | 列表头帮助信息 pop 位置                                                      | string    | 否       |
| helpPopPosition | 列表头帮助信息 pop 位置                                                      | string    | 否       |
| helpPopPosition | 列表头帮助信息 pop 位置                                                      | string    | 否       |

### selection

| 参数             | 说明                                                                                 | 类型                                                                                 | 是否必须 |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------- |
| onSelect         | 每次 check 的时候触发的函数,bool 为 true 会同步更新 selectedkeys，false 不会同步更新 | `(selectedkeys: string[], selectedRows: Array<any>, changeRow: any | any[]) => bool` | 否       |
| getCheckboxProps | 选择框属性配置 (当前仅支持 disabled)                                                 | (data: object) => { disabled?: boolean }                                             | 否       |

## 内置通用样式组件

### HeaderHelp

表头头部帮助信息展示，默认 icon 为 zent icon help-circle

```js
title: React.ReactNode;
headerHelp: React.ReactNode;
className?: string;
position?: PopPositions;
iconType?: IconType;
```

PopPositions:

与 zent Pop 组件 PopPositions 一致

`PopPositions = 'left-top' | 'left-center' | 'left-bottom' | 'right-top' | 'right-center' | 'right-bottom' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'auto-bottom-center' | 'auto-bottom-left' | 'auto-bottom-right' | 'auto-top-center' | 'auto-top-left' | 'auto-top-right';`

### quickEdit

快捷编辑，渲染一个带有输入框的快捷编辑组件，默认图标为`edit-o`，该方法是个纯函数，抛出一个接
收`bodyRender`的函数，这个函数返回一个 ReactNode，函数格式如下

```typescript
function quickEdit(NodeRender: ReactNode | string, quickEditOpts: IQuickEditConfig) => IGridColumns['bodyRender'];
```

quickEdit 有两个入参，第一个入参是表示需要挂载 quickEdit 的节点，可以是一个 string，表示要展示的字段
在 data 中的路径，与 grid columns 中的 name 表现一致；第二个字段表示 quickEdit 的配置

IQuickEditConfig 定义如下：

```typescript
// 快捷编辑的数据类型，有两种，分别是数字、文本
type: 'number' | 'text';
// 快捷编辑的触发图标
icon?: IconType;
// 默认值，可以是回调函数的形式，入参为当前行数据，类似bodyRender
defaultValue?: (data: any, name: string) => any | string | number;
// 确认操作的文本，默认为“确定”
confirmText?: string;
// 取消操作的文本，默认为“取消”
cancelText?: string;
// 是否回车键提交，默认为false
pressEnter?: boolean;
// 格式化，格式化onConfirm的入参
formatter?(value: string): any;
// 确定回调
onConfirm?(value: any): void;
// 关闭回调
onCancel?(): void;
placeholder?: string;
```

### GoodsBriefCard

表格中商品简要信息展示组件

```js
title: string;
price?: string | number;
label?: string;
labelTagTheme?: ITagProps['theme'];
labelOutline?: ITagProps['outline'];
labelProps?: ITagProps;
image?: string;
imageSize?: number;
url?: string;
className?: string;
```

| 参数          | 说明                                                        | 类型              | 默认值 | 是否必须 |
| ------------- | ----------------------------------------------------------- | ----------------- | ------ | -------- |
| title         | 商品名称                                                    |                   |        | 是       |
| price         | 商品价格                                                    | `string | number` |        | 否       |
| label         | 商品标签                                                    | string            |        | 否       |
| labelTagTheme | 标签主题 可选`'red' | 'green' | 'yellow' | 'blue' | 'grey'` | string            | 'red'  | 否       |
| labelOutline  | 标签边框有颜色，无底色                                      | bool              | false  | 否       |
| labelProps    | 标签 tag props                                              | `ITagProps`       |        | 否       |
| image         | 商品图片                                                    | string            |        | 否       |
| imageSize     | 商品图片大小                                                | number            | 60     | 否       |
| className     | 自定义样式                                                  | string            |        | 否       |
