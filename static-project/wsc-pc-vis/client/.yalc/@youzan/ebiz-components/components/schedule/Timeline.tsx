import React, { FC } from 'react';
import difference from 'date-fns/difference_in_calendar_days';
import addDays from 'date-fns/add_days';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import './style/timeline.scss';
import { format } from 'date-fns';

export interface ITimeLineProps {
  data: number[];
  rowHeight: number;
  interval: number;
  days?: number;
}

const getCellClassName = (time: number, interval: number, data: Array<number>, days: number) => {
  let className = 'ebiz-schedule__timeline__cell';
  const now = new Date().getTime();

  // 周的当前时间箭头
  if (days === 7 && now > startOfWeek(data[0]).getTime() && now < endOfWeek(data[0]).getTime()) {
    time = addDays(time, difference(now, time)).getTime();
  }

  if (time < now && now < time + interval * 60 * 1000) {
    className += '_now';
  }
  return className;
};

const TimeLine: FC<ITimeLineProps> = ({ data, days = 1, interval, rowHeight }) => {
  return (
    <div className="ebiz-schedule__timeline">
      {data.map(time => {
        return (
          <div key={time} className={getCellClassName(time, interval, data, days)} style={{ height: `${rowHeight}px` }}>
            {format(time, 'HH:mm')}
          </div>
        );
      })}
    </div>
  );
};

export default TimeLine;
