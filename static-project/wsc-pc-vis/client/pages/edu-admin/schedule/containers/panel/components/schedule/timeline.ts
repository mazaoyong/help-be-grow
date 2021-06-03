import { IViewData } from '../../types';

export const getHourPlusMinuteFromTime: (time: number) => number = (time) => {
  const date = new Date(time);
  return date.getHours() * 60 + date.getMinutes();
};

export const parseHourPlusMinute2String: (time: number) => string = (time) => {
  const hour = Math.floor(time / 60);
  const minute = time % 60;

  return `${paddingTime(hour)}:${paddingTime(minute)}`;
};

export const paddingTime = (time: number|string) => {
  return (time >= 10 ? '' : '0') + time;
};

export const isTimeinRange: (startTime: number, endTime: number, timeLineStart: number, timeLineEnd: number) =>
boolean = (startTime, endTime, timeLineStart, timeLineEnd) => {
  const startHourPlusMinute = getHourPlusMinuteFromTime(startTime);

  const endHourPlusMinute = getHourPlusMinuteFromTime(endTime);

  return !(endHourPlusMinute <= timeLineStart || startHourPlusMinute >= timeLineEnd);
};

export const getTimeLineStart: (timeLineStart: string, filterdata: IViewData, interval: number) =>
number = (timeLineStart, filterdata, interval) => {
  let hour = +timeLineStart.split(':')[0];
  let minute = +timeLineStart.split(':')[1];

  const data = { ...filterdata };
  Object.keys(data).map(key => {
    data[key].map(({ startTime, endTime }) => {
      const start = new Date(startTime).setHours(hour, minute, 0, 0);
      if (startTime < start && endTime > start) {
        hour = new Date(startTime).getHours();
        minute = new Date(startTime).getMinutes();
      }
    });
  });

  if (minute % interval !== 0) {
    minute -= minute % interval;
  }

  return hour * 60 + minute;
};

export const getTimeLineEnd: (timeLineEnd: string, filterdata: IViewData, interval: number) =>
number = (timeLineEnd, filterdata, interval) => {
  let hour = +timeLineEnd.split(':')[0];
  let minute = +timeLineEnd.split(':')[1];

  const data = { ...filterdata };

  Object.keys(data).map(key => {
    // data[key].map(({ startTime, endTime }) => {
    data[key].map(({ startTime, endTime }) => {
      const end = new Date(endTime).setHours(hour, minute, 0, 0);
      if (startTime < end && endTime > end) {
        hour = new Date(endTime).getHours();
        minute = new Date(endTime).getMinutes();
      }
    });
  });

  if (minute % interval !== 0) {
    minute = Math.ceil(minute / interval) * interval;
    if (minute % 60 === 0) {
      hour += 1;
      minute = 0;
    }
  }

  return hour * 60 + minute;
};

export const getFirstTimeline: (data: IViewData, timeLineStart: number, timeLineEnd: number) =>
number | null = (data, timeLineStart, timeLineEnd) => {
  let firstTime: number | null = null;
  Object.keys(data).map(key => {
    data[key].map(item => {
      if (isTimeinRange(item.startTime, item.endTime, timeLineStart, timeLineEnd)) {
        const startHourPlusMinute = getHourPlusMinuteFromTime(item.startTime);
        if (!firstTime || startHourPlusMinute < getHourPlusMinuteFromTime(firstTime)) {
          firstTime = item.startTime;
        }
      }
    });
  });

  return firstTime;
};
