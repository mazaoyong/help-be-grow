---
order: 4
title: 通过Context获取上下文
subtitle:
debug: true
---

通过ref和connect获取`List`上下文

## 上下文 context

| 属性        | 说明                                                                 | 类型         |
| ----------- | -------------------------------------------------------------------- | ------------ |
| state       | 列表筛选相关的所有内部状态                                           | IListState   |
| globalState | 自定义全局状态（可以存储其他业务状态，由 setGlobalState 方法设置的） | IGlobalState |
| action      | 列表筛选相关所有操作                                                 | IListAction  |

## IListState 类型

```typescript
interface IFilter {
  /* 分页大小 */
  pageSize: number;
  [propName: string]: any;
}

interface IListState {
  /* 当前页码 */
  page: number;
  /* 筛选项 */
  filter: IFilter;
  /* 列表总数 */
  total: number;
  /* 列表数据 */
  dataset: any[];
  /* 是否loading */
  loading: boolean;
}
```

## IGlobalState 类型

```typescript
interface IGlobalState {
  [propName: string]: any;
}
```

## IListAction 类型

```typescript
type IRefresh = () => void;
type ISetDataSetFn = (data: any[]) => void;
type ISetPageFn = (page: number) => void;
type ISetFilterFn = (nextFilter: any) => void;
type ISetLoadingFn = () => void;
type IStopLoadingFn = () => void;
type ISetGlobalStateFn = (state: any) => void;

interface IListAction {
  /* 刷新当前列表（请求参数不变） */
  refresh: IRefresh;
  /* 重新设置dataSet（仅特殊场景使用） */
  setDataset: ISetDataSetFn;
  /* 设置页码（刷新列表，页码重制为1） */
  setPage: ISetPageFn;
  /* 设置筛选想() */
  setFilter: ISetFilterFn;
  /* 刷新当前列表（请求参数不变） */
  setLoading: ISetLoadingFn;
  /* 刷新当前列表（请求参数不变） */
  stopLoading: IStopLoadingFn;
  /* 刷新当前列表（请求参数不变） */
  setGlobalState: ISetGlobalStateFn;
}
```

```jsx
import { EasyList } from '@youzan/ebiz-components';
const { List, EasyGrid, connect } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true, },
  { title: '发布时间', name: 'publishTime', needSort: true, },
];

const BASEOPTIONS = [
  { text: '选项1', value: '0' },
  { text: '选项2', value: '1' },
  { text: '选项3', value: '2' },
];

const Button = connect(props => {
  return (
    <button onClick={props.list.action.refresh}>刷新列表2</button>
  )
})

class ContextDemo extends React.Component {
  refresh = () => {
    if (this.list) {
      console.log(this.list);
      this.list.action.refresh();
    }
  }

  fetch() {
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
      }, 2000)
    });
  }

  change = () => {
    if (this.list) {
      const { action: { setDataset }, state: { dataset } } = this.list;
      const nextData = dataset.map(one => ({
        ...one,
        operatorName: '修改人change'
      }))
      this.list.action.setDataset(nextData);
    }
  }

  getRef = (ref) => {
    this.list = ref;
  }

  render() {
    return (
      <List ref={this.getRef} onSubmit={this.fetch} defaultFilter={{ pageSize: 10 }}>
        <button onClick={this.refresh}>刷新列表</button>
        <Button />
        <button onClick={this.change}>修改列表数据</button>
        <EasyGrid columns={columns} />
      </List>
    )
  }
}

ReactDOM.render(<ContextDemo />, mountNode);
```