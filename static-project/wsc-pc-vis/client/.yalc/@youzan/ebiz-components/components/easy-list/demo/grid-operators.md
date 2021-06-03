---
order: 5
title: 方便的编写各类Operators
subtitle:
---

EasyGrid简化了grid表格操作，大致归为Pop和SweetAlert，也给出了表格内有pop需要状态维护的情况（类似审核操作）。

## GridPop特殊属性

1. preventDefault 是否阻止默认行为，当想点击触发按钮而不想事件冒泡的时候，请声明这个属性
2. adjustPositionOnShow 是否在展示时调整位置，用于展示时调整Pop的位置

```jsx
import { useState, useCallback } from 'react';
import { Button, Notify, Sweetalert, Radio } from 'zent';
import { Operations } from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';
import '@youzan/react-components/es/components/operations/style/index.css';

const { List, EasyGrid, GridPop, GridSweetAlert } = EasyList;
const RadioGroup = Radio.Group;

function Verify({ pop, data, list }) {
  const [value, setValue] = useState(true);
  const text = value ? '审核通过' : '审核不通过';
  const save = useCallback(() => {
    alert(`${data.title} ${text}`);
    pop.close();
    list.action.refresh();
  }, [data, text]);
  return (
    <RadioGroup onChange={e => setValue(e.target.value)} value={value}>
      <span style={{ fontSize: 14 }}>{data.title}</span>
      <Radio value={true}>通过</Radio>
      <Radio value={false}>不通过</Radio>
      <Button type="primary" onClick={save}>保存</Button>
      <Button onClick={pop.close}>取消</Button>
    </RadioGroup>
  )
}

const columns = [
  {
    title: '标题',
    name: 'title'
  },
  {
    title: '发布顺序',
    name: 'updateOrder'
  },
  {
    title: '修改人',
    needSort: true,
    name: 'operatorName'
  },
  { title: '发布时间', name: 'publishTime', needSort: true, },
  {
    title: '操作',
    bodyRender(data) {
      return (
        <Operations
          id={data.id}
          items={[
            <a href="https://www.youzan.com">跳转到有赞</a>,
            <GridPop
              trigger="hover"
              text="删除"
              content="现在就是不能删除"
              disabled
            />,
            <GridPop
              trigger="click"
              text="启用"
              content="现在要启用吗？"
              onConfirm={() => { Sweetalert.alert({ content: '启用了' }) }}
              onCancel={() => { Sweetalert.alert({ content: '取消' }) }}
            />,
            <GridSweetAlert
              text="弹窗删除"
              content="你确定要删除吗?"
              onConfirm={() => { Sweetalert.alert({ content: '删除了' }) }}
              onCancel={() => { Sweetalert.alert({ content: '取消' }) }}
            />,
            <GridPop
              trigger="hover"
              text="弹窗内的禁用"
              content="现在就是不能删除"
              disabled
            />,
            <GridPop
              trigger="click"
              data={data}
              text={<span>审核</span>}
            >
            {
              ctx => {
                return <Verify {...ctx} />
              }
            }
            </GridPop>,
          ]}
        />
      )
    }
  }
];

let deleteDataIds = [];

class Customer extends React.Component {
  onClick = () => {
    const { data } = this.props;
    Notify.success(`${data.length} elements was selected`);
    deleteDataIds = data.map(item => item.id);
    const { refresh } = this.props.list.current.action;
    refresh();
  };

  render() {
    return (
      <Button onClick={this.onClick}>批量删除</Button>
    );
  }
}

class GridOperators extends React.Component {
  list = React.createRef()

  render() {
    return (
      <List mode="hash" onSubmit={fetch} ref={this.list}>
        <EasyGrid
          columns={columns}
        />
      </List>
    )
  }
}

function fetch(query) {
  const list = [];
  for (let i = 0; i < 10; i++) {
    if (deleteDataIds.indexOf(i) === -1) {
      list.push({
        id: i,
        title: `标题${i}`,
        subtitle: `副标题${i}`,
        updateOrder: i + 1,
        operatorName: `修改人${i}`,
        publishTime: '2019-04-07'
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
          total: 30
        }
      })
    }, 1000);
  })
}

ReactDOM.render(<GridOperators />, mountNode);
```