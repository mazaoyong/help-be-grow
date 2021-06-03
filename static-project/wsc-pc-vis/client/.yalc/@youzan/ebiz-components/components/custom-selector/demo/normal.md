---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的相关描述

```jsx
import { CustomSelector as chooseDialog } from '@youzan/ebiz-components';
import { Button } from 'zent';

const options={
    // 头部筛选
    header: {
      component: <div></div>,
      children: [],
    },

    // 主体列表
    table: {
      columns: [],

      rowKey: 'assetNo',

      getRowConf: (data, index) => {},

      selectedRows: [],
    },

    // 底部按钮
    footer: {
      component: <div></div>,
    },

    // 弹窗外壳
    title: '选择学员',

    onSelect: selectedData => Promise.resolve(),

    onFetch: ({ header, table, footer }) => Promise.resolve(),

    onSubmit: data => Promise.resolve,
};
const BasicDemo = props => {
  const d = open
  return (
    <div>
      <Button type="primary" onClick={() => chooseDialog(options)}>点我</Button>
    </div>
  )
}

ReactDOM.render(<BasicDemo />, mountNode);
```