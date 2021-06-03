---
order: 0
title: 基础用法
subtitle: Basic
---

```jsx
import { Icon } from '@youzan/ebiz-components';

const icons = ['boy', 'girl', 'calendar', 'calendar-o', 'list', 'list-o', 'picture-o', 'followup-o', 'lookup', 'wechat', 'doc', 'drag', 'consumption', 'consumption-hand', 'classhour', 'classhour-hand', 'move-down', 'move-up', 'remove'];

const BasicDemo = () => {
  return (
    <>
      {icons.map(icon => {
        return <Icon key={icon} type={icon} />;
      })}
      <br />
      {icons.map(icon => {
        return <Icon key={icon} type={icon} color="red" />;
      })}
      <br />
      {icons.map(icon => {
        return <Icon key={icon} type={icon} size="50px" />;
      })}
    </>
  );
};



ReactDOM.render(<BasicDemo />, mountNode);
```