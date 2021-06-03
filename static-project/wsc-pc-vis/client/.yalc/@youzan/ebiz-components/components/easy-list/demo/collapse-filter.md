---
order: 14
title: Filter折叠筛选项
subtitle: 通过配置collapseConfig来折叠某些选项
---

通过设置`collapseConfig`属性，能够折叠部分筛选项，并且会在操作区域添加一个`收起/展开`的按钮。

## Config

使用方法同`config`属性相同，只需要将需要隐藏的配置从 config 中移至 collapseConfig 即可 <br/>

| 属性                  | 描述                                                   | 类型                   | 默认值             | 是否必填 |
| --------------------- | ------------------------------------------------------ | ---------------------- | ------------------ | -------- |
| collapseConfig        | 设置折叠显示的筛选项                                   | 类型定义同`config`属性 | -                  | false    |
| collapseSwitcherLabel | 折叠开关的文案，前者为展开状态提示，后者为缩起状态提示 | `[string, string]`     | `['收起', '展开']` | false    |
| defaultCollapseState  | 默认折叠状态                                           | `expand | collapse`    | `collapse`         | false    |

```jsx
import { Button } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
const { Filter } = EasyList;

const simpleConfig = [
  [
    {
      name: 'username',
      label: '用户名：',
      type: 'Input',
      inheritProps: {
        placeholder: '请输入用户名',
      },
    },
  ],
  [
    {
      name: 'password',
      label: '密码：',
      type: 'Input',
      inheritProps: {
        type: 'password',
        placeholder: '请输入密码',
      },
    },
  ],
];
const collapseConfig = [
  [
    {
      name: 'memoUsername',
      label: '记住用户名：',
      type: 'Radio',
      options: [
        { text: '是', value: 1 },
        { text: '否', value: 0 },
      ],
    },
    {
      name: 'memoPassword',
      label: '记住密码：',
      type: 'Radio',
      options: [
        { text: '是', value: 1 },
        { text: '否', value: 0 },
      ],
    },
  ],
  [
    {
      name: 'disclaimer',
      label: '免责声明',
      type: 'Custom',
      renderField: () => <a href="https://youzan.com">声明链接</a>,
    },
  ],
];

const CollapseFilter = () => {
  return (
    <Filter
      config={simpleConfig}
      actionsOption={{
        beforeReset: <Button>按钮</Button>,
      }}
      collapseConfig={collapseConfig}
    />
  );
};
ReactDOM.render(<CollapseFilter />, mountNode);
```
