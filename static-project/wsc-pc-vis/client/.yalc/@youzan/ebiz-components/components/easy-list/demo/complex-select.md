---
order: 6
title: 控制表格是否可选
subtitle: 通过设置selection的值，能够控制表格是否可以选择以及是否是一个单选表格
---

可以通过使用`easySelection=true`来设置开启表格的多选功能；当然，也可以使用`selection=true` 来达到相
同的功能；同时`selection`字段除了支持`zent`的字段之外，还支持`selectType`字段，能够通过设
置`selection.selectType='single'`来让表格渲染单选按钮

## selection

`onSelect`能够通过返回一个布尔值来控制是否能够选中当前行。

```
1. selection: true | 'multiple'     表格展示多选
2. selection: 'single'              表格展示单选
3. selection: false | undefined     表格不可选
```

```jsx
import { Button, Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
const { List, Filter, EasyGrid } = EasyList;

const columns = [
  { title: '标题', name: 'title' },
  { title: '修改时间', name: 'updatedAt' },
  { title: '修改人', name: 'operatorName', needSort: true },
  { title: '发布时间', name: 'publishTime', needSort: true },
];

let deleteDataIds = [];

class Customer extends React.Component {
  onClick = () => {
    const { data } = this.props;
    Notify.success(`${data.length} elements was selected`);
    deleteDataIds = data.map((item) => item.id);
    const { refresh } = this.props.list.current.action;
    refresh();
    console.log(this.props.data);
    console.log(this.props.list);
  };

  render() {
    return <Button onClick={this.onClick}>批量删除</Button>;
  }
}

class ComplexSelect extends React.Component {
  list = React.createRef();

  render() {
    return (
      <List mode="hash" onSubmit={fetch} ref={this.list}>
        <EasyGrid
          columns={columns}
          selection={{
            selectType: 'single',
            selectedRowKeys: ['0'],
            getCheckboxProps(data) {
              return {
                disabled: Number(data.id) % 2 === 0,
              };
            },
          }}
        />
        <EasyGrid
          columns={columns}
          selection={{
            selectedRowKeys: ['0', '2'],
            onSelect: (selectedRowKeys, selectedRows, currentRow) => {
              if (selectedRowKeys.length > 2) {
                Notify.error('你最多选择两个');
                return false;
              }
              return true;
            },
            getCheckboxProps: (data) => ({
              disabled: data.title === '标题1',
            }),
          }}
          batchRender={(data) => <Customer data={data} list={this.list} />}
        />
      </List>
    );
  }
}

function fetch(query) {
  const list = [];
  for (let i = 0; i < 10; i++) {
    if (deleteDataIds.indexOf(i) === -1) {
      list.push({
        id: String(i),
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
          pageSize: 10,
          total: 30,
        },
      });
    }, 1000);
  });
}

ReactDOM.render(<ComplexSelect />, mountNode);
```
