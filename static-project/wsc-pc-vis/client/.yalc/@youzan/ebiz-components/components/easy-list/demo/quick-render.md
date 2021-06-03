---
order: 7
title: 渲染Grid
subtitle: 能够通过一个简单的配置，快速生成不同样式的Grid组件
---

> EasyGrid 提供了 easySelection 配置项，简化了 grid selection 相关配置，同时，你还能通过`EasyList`内
> 部提供的组件和高阶函数快速渲染出一些不同样式的列表，比如：

## 通过`HeaderHelp`组件，快速渲染一个带有 ❓ 的表头

表头头部帮助信息展示，默认 icon 为 zent icon help-circle

| 参数       | 说明                            | 类型              | 默认值                | 是否必须 |
| ---------- | ------------------------------- | ----------------- | --------------------- | -------- |
| title      | 标题名称                        |                   |                       | 是       |
| headerHelp | 提示信息内容                    | `React.ReactNode` |                       | 是       |
| className  | 样式                            | string            |                       | 否       |
| position   | 出现的位置，同 zent/PopPosition | `PopPositions`    | Position.BottomCenter | 否       |
| iconType   | 图标名，参考 zent/icon          | IconType          |                       | 否       |

### PopPositions

与 zent Pop 组件 PopPositions 一致

## 使用`quickEditRender`帮助快速的在你想要的单元格渲染出快捷编辑气泡

快捷编辑，渲染一个带有输入框的快捷编辑组件，默认图标为`edit-o`，该方法是个纯函数，抛出一个接
收`bodyRender`的函数，这个函数返回一个 ReactNode，函数格式如下

```typescript
function quickEdit(NodeRender: ReactNode | string, quickEditOpts: IQuickEditConfig) => IGridColumns['bodyRender'];
```

quickEdit 有两个入参，第一个入参是表示需要挂载 quickEdit 的节点，可以是一个 string，表示要展示的字段
在 data 中的路径，与 grid columns 中的 name 表现一致；第二个字段表示 quickEdit 的配置

### IQuickEditConfig 定义如下：

| 参数         | 说明                                                                                                          | 类型                              | 默认值            | 是否必须 |
| ------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- | -------- | --- | --- |
| type         | 快捷编辑的数据类型，有两种，分别是数字、文本                                                                  | `number                           | text`             |          | 是  |
| icon         | 快捷编辑的触发图标                                                                                            | `IconType`                        |                   | 否       |
| defaultValue | 默认值，可以是回调函数的形式，入参为当前行数据，类似 bodyRender                                               | `(data: any, name: string) => any | string            | number`  |     | 否  |
| confirmText  | 确认操作的文本，默认为“确定”                                                                                  | string                            | '确定'            | 否       |
| cancelText   | 取消操作的文本，默认为“取消”                                                                                  | string                            | '取消'            | 否       |
| pressEnter   | 是否回车键提交，默认为 false                                                                                  | boolean                           | false             | 否       |
| formatter    | 格式化，格式化 onConfirm 的入参                                                                               | `(value: any) => void             | Promise<boolean>` |          | 否  |
| onConfirm    | 🍀 确定的回调，如果确定返回一个 Promise，那么确定按钮会被置为 loading 状态，取消按钮将在 loading 期间不可选中 | number                            | 60                | 否       |
| onCancel     | 关闭回调                                                                                                      | `() => void`                      |                   | 否       |
| placeholder  | 占位符                                                                                                        | string                            |                   | 否       |
| required     | 是否必填                                                                                                      | `string                           | boolean`          |          | 否  |
| validators   | 🍀 和 zent 的 Validators 通用                                                                                 | `ISyncValidator<string            | number>[]`        |          | 否  |

## 使用`GoodsBriefCard`来帮助你快速渲染出一个商品卡片

### 表格中商品简要信息展示组件

| 参数          | 说明                   | 类型        | 默认值   | 是否必须 |
| ------------- | ---------------------- | ----------- | -------- | -------- | ------- | ------ | ----- | --- |
| title         | 商品名称               |             |          | 是       |
| price         | 商品价格               | `string     | number`  |          | 否      |
| label         | 商品标签               | string      |          | 否       |
| labelTagTheme | 标签主题 可选`'red'    | 'green'     | 'yellow' | 'blue'   | 'grey'` | string | 'red' | 否  |
| labelOutline  | 标签边框有颜色，无底色 | bool        | false    | 否       |
| labelProps    | 标签 tag props         | `ITagProps` |          | 否       |
| image         | 商品图片               | string      |          | 否       |
| imageSize     | 商品图片大小           | number      | 60       | 否       |
| className     | 自定义样式             | string      |          | 否       |

## 配置`customColumns`属性允许自定义表头

通过设置`customColumns`属性，能够很方便的渲染出一个自定义表头按钮，供使用者自定义表头。以下是相
关`API`

| 参数                     | 说明                                                               | 类型    | 默认值     | 是否必须 |
| ------------------------ | ------------------------------------------------------------------ | ------- | ---------- | -------- |
| customColumns            | 是否允许自定义表头                                                 | boolean | false      | 否       |
| customColumnsTriggerText | 设置触发设置自定义表头弹窗按钮的文案                               | string  | 配置表头   | 否       |
| customColumnsDialogTitle | 自定义表头弹窗的标题                                               | string  | 自定义表头 | 否       |
| columns.altTitle         | `columns` 配置中，`title`的备用字段，在`title`不为字符串时可以设置 | string  |            | 否       |
| columns.forbidCustom     | `columns` 配置中，控制当前列是否参与自定义                         | boolean | false      | 否       |

---

```jsx
import { Button, Notify, Validators } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
const { List, EasyGrid, HeaderHelp, quickEditRender, GoodsBriefCard } = EasyList;

const columns = [
  {
    title: '标题(可编辑)',
    headerHelp: '这是一个帮助提示',
    width: '160px',
    bodyRender: quickEditRender('title', {
      validators: [Validators.maxLength(8, '最多输入8个字符')],
      onConfirm() {
        return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
      },
    }),
  },
  {
    title: '商品',
    name: 'goods',
    width: 267,
    bodyRender: (data) => {
      const { goods } = data;
      const { title, label, price, url } = goods;
      const labelProps = { theme: 'grey' };
      return (
        <GoodsBriefCard
          title={title}
          label={label}
          labelTagTheme="red"
          labelOutline
          price={price}
          url={url}
          image="https://img.yzcdn.cn/upload_files/2019/12/13/Fv6S5Gty68hyMYLznLuxF4Wifhm9.jpg!small.webp"
        />
      );
    },
  },
  {
    title: <HeaderHelp title="修改时间" headerHelp="这是一个帮助提示title" />,
    name: 'updatedAt',
  },
  {
    title: '修改人',
    name: 'operatorName',
    headerHelp: (
      <>
        <span>这是一个帮助提示xxx</span>
        <a href="https://www.youzan.com/" target="_blank">
          查看详情
        </a>
      </>
    ),
    needSort: true,
  },
  { title: '发布时间', name: 'publishTime', needSort: true },
];
let deleteDataIds = [];

// zent 方式使用
const zentColumns = [
  {
    title: '商品名',
    name: 'name',
    bodyRender: quickEditRender('name', {
      validators: [Validators.maxLength(8, '最多输入8个字符')],
      onConfirm(value) {
        return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
      },
    }),
  },
  {
    title: '访问量',
    name: 'uv',
  },
  {
    title: '库存',
    name: 'stock',
  },
  {
    title: '创建时间',
    name: 'createdTime',
    width: 140,
    fixed: 'right',
  },
];
const totalItem = 40;
let currentPageSize = 20;
let currentPage = 1;
const datasets = [];

for (let i = 0; i < currentPageSize; i++) {
  datasets.push({
    id: `f-${i}`,
    name: `母婴商品 ${i}`,
    uv: 20,
    stock: 5,
    createdTime: '2019-11-21',
  });
}

class Customer extends React.Component {
  onClick = () => {
    const { data, list, grid } = this.props;
    Notify.success(`${data.length} elements was selected`);
    deleteDataIds = data.map((item) => item.id);

    const { setSelectedRowKeys } = grid.current;
    setSelectedRowKeys([]);

    const { refresh } = this.props.list.current.action;
    refresh();
  };

  render() {
    return <Button onClick={this.onClick}>批量删除</Button>;
  }
}

class QuickRender extends React.Component {
  list = React.createRef();
  grid = React.createRef();

  render() {
    return (
      <div>
        <p>使用EasyList接管数据（datasets）部分</p>
        <List mode="hash" onSubmit={fetch} ref={this.list}>
          <EasyGrid
            ref={this.grid}
            columns={columns}
            easySelection
            pageSizeOptions={[5, 20]}
            batchRender={(data) => <Customer data={data} list={this.list} grid={this.grid} />}
          />
        </List>
        <p>自行组织datasets</p>
        <EasyGrid
          columns={zentColumns}
          datasets={datasets}
          pageNumber={currentPage}
          pageSize={currentPageSize}
          total={totalItem}
          onChange={(conf) => {
            const { current, pageSize } = conf;
            if (current) currentPage = current;
            if (pageSize) currentPageSize = pageSize;
          }}
          easySelection
          customColumns
          selection={{
            selectedRowKeys: ['f-1'],
          }}
          rowKey="id"
          scroll={{ x: 1300 }}
        />
      </div>
    );
  }
}

function fetch(query) {
  console.log('fetch', query);
  const { pageSize } = query;
  const list = [];
  for (let i = 0; i < pageSize; i++) {
    if (deleteDataIds.indexOf(i) === -1) {
      list.push({
        id: i,
        goods: {
          title: `这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案${i}`,
          price: `${i}`,
          label: `商品`,
          url:
            'https://shop192223.m-qa.youzan.com/wscgoods/detail/2op0ui37m9egn?alias=2op0ui37m9egn',
        },
        title: `标题${i}`,
        updatedAt: '2019-04-07',
        operatorName: `修改人${i}`,
        publishTime: '2019-04-07',
      });
    }
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        dataset: list,
        pageInfo: {
          page: query.page,
          pageSize,
          total: 30,
        },
      });
    }, 1000);
  });
}

ReactDOM.render(<QuickRender />, mountNode);
```
