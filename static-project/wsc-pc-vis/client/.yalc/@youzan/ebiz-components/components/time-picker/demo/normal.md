---
order: 0
title: 基础用法
subtitle: Basic
debug: true
---

这里是组件的相关描述

```jsx
import { TimePicker } from '@youzan/ebiz-components';
import './usage.scss';

class BasicDemo extends React.Component {
  state = {
    v1: '12:22:22',
    v2: { hour: 1, minute: 8 },
    v3: 4288,
    v4: [13],
    v5: [13, 22, 33]
  };

  render() {
    const { v1, v2, v3, v4, v5 } = this.state;

    return (
      <>
        <TimePicker
          name="timepicker"
          type="HH:mm:ss"
          value={v1}
          onChange={val => {
            this.setState({ v1: val });
          }}
          disabledTime={{
            disabledHours: h => {
              return h < new Date().getHours();
            },
            disabledMinutes: [22, 36, 60],
            disabledSeconds: date => {
              return date % 5 !== 0;
            },
            disabledAll: [
              { hour: 10, minute: 10, second: 0 },
              { hour: 10, minute: 20, second: 5 }
            ]
          }}
          hideTime={{
            disabledHours: [4, 5, 6]
          }}
        />
        <TimePicker
          name="timepicker"
          type="HH:mm"
          clearable
          value={v2}
          onChange={val => {
            this.setState({ v2: val });
          }}
          disabledTime={{
            disabledAll: [{ hour: 10, minute: 20 }, { hour: 11, minute: 11 }]
          }}
        />
        <TimePicker
          name="timepicker"
          type="HH:mm:ss"
          clearable
          value={v3}
          onChange={val => {
            this.setState({ v3: val });
          }}
          disabledTime={{
            disabledHours: [1, 2, 3],
            disabledMinutes: [22, 23, 21],
            disabledSeconds: date => {
              return date % 5 !== 0;
            },
            disabledAll: ({ hour, minute }) => {
              return hour % 8 === 2 && minute % 10 === 0;
            }
          }}
        />
        <TimePicker
          name="timepicker"
          type="HH:mm:ss"
          value={v4}
          disabled
          onChange={val => {
            this.setState({ v4: val });
          }}
        />
        <TimePicker
          name="timepicker"
          type="HH:mm:ss"
          value={v5}
          onChange={val => {
            this.setState({ v5: val });
          }}
          hideTime={{
            disabledAll: ({ hour, minute }) => {
              return hour % 8 === 2 && minute % 10 === 0;
            }
          }}
        />
      </>
    );
  }
}

ReactDOM.render(<BasicDemo />, mountNode);
```