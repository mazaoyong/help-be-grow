---
order: 0
title: 基础用法
subtitle: Basic
debug: true
---

这里是组件的相关描述

```jsx
import { Calendar } from '@youzan/ebiz-components';
import { Badge, ClampLines } from 'zent';

const { Calendar: CalendarDashboard } = Calendar;

function getListData(value) {
  let listData;
  switch (value.getDate()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' }
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' }
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' }
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul>
      {listData.map(item => (
        <li key={item.content}>
          <ClampLines lines={1} showPop={false} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

function BasicDemo() {
  const [date, setDate] = React.useState(new Date());

  return (
    <CalendarDashboard
      current={date}
      weekStartsOn={1}
      onMonthChange={date => setDate(date)}
      onSelect={date => console.log(date)}
      dateCellRender={dateCellRender}
    />
  );
}

ReactDOM.render(<BasicDemo />, mountNode);
```