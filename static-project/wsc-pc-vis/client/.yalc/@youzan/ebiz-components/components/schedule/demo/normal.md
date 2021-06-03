---
order: 0
title: 基础用法
subtitle: Basic
---

基础用法

> 这里是组件的相关描述

```jsx
import { Schedule } from '@youzan/ebiz-components';
import { format } from 'date-fns';
import './usage.scss';

const mockData = {
  '2019-03-05': [
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:15-11:00',
      startTime: 1551752100000, // 10:15
      endTime: 1551754800000 // 11:00
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:20-12:00 ',
      startTime: 1551752400000, // 10:20
      endTime: 1551758400000 // 12:00
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:15-11:45',
      startTime: 1551752100000, // 10:15
      endTime: 1551757500000 // 11:45
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:15-10:30',
      startTime: 1551752100000, // 10:15
      endTime: 1551753000000 // 10:30
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:30-10:45',
      startTime: 1551753000000, // 10:30
      endTime: 1551753900000 // 10:45
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:30-10:45',
      startTime: 1551753000000, // 10:30
      endTime: 1551753900000 // 10:45
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 10:45-11:00',
      startTime: 1551753900000, // 10:45
      endTime: 1551754800000 // 11:00
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 13:00-15:00',
      startTime: 1551762000000, // 13:00
      endTime: 1551769200000 // 15:00
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 12:00-14:00',
      startTime: 1551758400000, // 12:00
      endTime: 1551765600000 // 14:00
    },
    {
      date: '2019-03-05',
      eduCourseName: '拉丁舞 19:00-21:00',
      startTime: 1551783600000, // 19:00
      endTime: 1551790800000 // 21:00
    }
  ],
  '2019-03-06': [
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 10:00-12:00',
      startTime: 1551837600000, // 10:00
      endTime: 1551844800000 // 12:00
    },
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 09:30-11:30',
      startTime: 1551835800000, // 09:30
      endTime: 1551843000000 // 11:30
    },
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 09:45-11:20',
      startTime: 1551836700000, // 09:45
      endTime: 1551842400000 // 11:20
    },
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 10:00-12:00',
      startTime: 1551837600000, // 10:00
      endTime: 1551844800000 // 12:00
    },
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 09:30-11:30',
      startTime: 1551835800000, // 09:30
      endTime: 1551843000000 // 11:30
    },
    {
      data: '2019-03-06',
      eduCourseName: '幼儿编程课 09:45-11:20',
      startTime: 1551836700000, // 09:45
      endTime: 1551842400000 // 11:20
    }
  ]
};

const dateCellRender = data => {
  const cp = [...data];
  cp.splice(3);

  return (
    <>
      {cp.map((item, i) => {
        return (
          <div className="cell-item" key={item.startTime.toString() + i}>
            <span>{item.data}</span>
            <span>{item.eduCourseName}</span>
          </div>
        );
      })}
    </>
  );
};

const BasicDemo = () => {
  const [type, setType] = React.useState('day');
  const [interval, setIntervalValue] = React.useState(60);
  const [weekStartsOn, useWeekStartsOn] = React.useState(1);

  return (
    <div className="schedule-wrap">
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="day">日</option>
        <option value="week">周</option>
        <option value="month">月</option>
      </select>
      {type !== 'month' && (
        <select
          value={interval}
          onChange={e => setIntervalValue(parseInt(e.target.value, 10))}
        >
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>
      )}
      {type !== 'day' && (
        <select
          value={weekStartsOn}
          onChange={e => useWeekStartsOn(parseInt(e.target.value, 10))}
        >
          <option value={1}>周一</option>
          <option value={2}>周二</option>
          <option value={3}>周三</option>
          <option value={4}>周四</option>
          <option value={5}>周五</option>
          <option value={6}>周六</option>
          <option value={0}>周日</option>
        </select>
      )}

      <Schedule
        {...{
          type,
          interval,
          weekStartsOn,
          data: mockData,
          max: 4,
          interval,
          rowHeight: 300,
          timeLineStart: '11:00',
          timelineEnd: '24:00',
          current: new Date('2019-03-05'),
          renderField: time => {
            return (
              <div className="schedule-field">{time['eduCourseName']}</div>
            );
          },
          dateCellRender: dateCellRender,
          renderBackRow: _ => {
            return <div />;
          },
          renderWeekDays: date => {
            return format(date, 'M-DD');
          }
        }}
      />
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```