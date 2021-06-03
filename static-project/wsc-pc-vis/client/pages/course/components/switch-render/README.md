# 选择渲染组件

## 使用
```
<SwitchRender<IPopProps>
  value={isShow}
  component={Pop}
  componentProps={{
    trigger: 'hover',
    position: 'bottom-left',
  }}
>
  <div>hello</div>
<SwitchRender>
```

## API
name | 说明 | 默认值
-|-|-
value | 是否使用Component包裹children | -
component | 包裹组件 | -
componentProps: | 包裹组件props | -
children: | 自元素 | -