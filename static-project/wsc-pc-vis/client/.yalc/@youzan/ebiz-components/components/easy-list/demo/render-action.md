---
order: 13
title: 渲染Filter的操作按钮
subtitle: renderAction
---

## Filter

| 属性名        | 描述                                                                                                                                 | 类型                                                                                                                         | 默认值     | 是否必填 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| renderActions | 用于渲染底部操作按钮的组件，如果不指定这个属性，会渲染”筛选“和”重置筛选项“两个按钮                                                   | ComponentType<{filter: [Filter](#Filter)}>                                                                                   | -          | false    |
| actionsOption | 渲染 Actions 的配置                                                                                                                  | 见Action组件的配置                                                                                                            | -          | false    |

## Actions 组件

> 为了方便使用，还提供了 Actions 组件，这个组件会默认渲染“筛选”和“重置筛选条件”两个按钮

| 属性        | 描述                     | 类型                     | 默认值 | 是否必填                                        |
| ----------- | ------------------------ | ------------------------ | ------ | ----------------------------------------------- |
| filter      | Filter 组件的 ref 对象   | object                   | -      | 如果是配置 actionsOption 属性，则该属性为非必填 |
| beforeReset | 渲染在重置按钮之前的节点 | ReactNode \| ReactNode[] | -      | false                                           |
| afterReset  | 渲染在重置按钮之后的节点 | ReactNode \| ReactNode[] | -      | false                                           |

### 渲染底部操作按钮

> 同时你还能使用 renderActions 方法。renderActions 的入参包括以下三个方法，用于触发 url 更新和修改

```typescript
interface IRenderPropsType {
  submit(): void; // 提交filter数据，会触发url更新
  reset(): void; // 重设filter数据，会触发url更新
  getQueries(): Record<string, any>; // 获取当前的filter参数，不会触发url更新
  getLoading(): boolean; // 获取组件的loading状态
}
```

```jsx
import { Button, Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
const { Filter, Action } = EasyList;

const config = [
  {
    name: 'description',
    label: '描述信息:',
    type: 'Input',
    width: 200,
    inheritProps: {
      placeholder: '请输入你对商品的描述'
    }
  }
];

const actionsOption = {
  beforeReset: [<Button key="button0">更新</Button>],
  afterReset: [<Button key="button1">导出</Button>]
};

const CustomAction = ({ filter }) => {
  return (
    <Button type="primary" onClick={filter.submit}>骚骚的按钮</Button>
  )
}

const RenderAction = props => {
  return (
    <section>
      <h4>Filter默认会带有一个提交按钮</h4>
      <Filter config={config} />
      <h4>你可以通过指定actionsOption方法上的Filter对象获取当前filter的值</h4>
      <Filter
        config={config}
        actionsOption={{
          beforeReset(filter) {
            return <Button onClick={() => Notify.info(filter.getCurrentValues().description)}>显示描述信息</Button>
          }
        }}
      />
      <h4>通过配置，快速指定重置按钮之前的按钮，以及之后的按钮</h4>
      <Filter config={config} actionsOption={actionsOption} />
      <h4>你还可以通过使用filter对象配合Action来自己渲染</h4>
      <Filter config={config} renderActions={CustomAction} />
    </section>
  );
};

ReactDOM.render(<RenderAction />, mountNode);
```
