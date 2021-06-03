import DateUtil from '@youzan/utils/date';
// import { IProviderProps, DispatchType } from '../../store';
// import { formatQuery } from '../../format';
// import { getScheduleViewAPI } from '../../../../api';
// import { setQuery } from '../../../../utils/query';
// import { Notify } from 'zent';
// import cloneDeep from 'lodash/cloneDeep';
// import YZLocalStorage from 'zan-utils/local_storage';
const { parseDate } = DateUtil;

export interface ICurrentAppointment {
  appointId: string;
  date: string;
  lessonTime: string;
}

export const parseHourPlusMinute2String: (time: number) => string = (time) => {
  const hour = Math.floor(time / 60);
  const minute = time % 60;

  return `${paddingTime(hour)}:${paddingTime(minute)}`;
};

export const paddingTime = (time: number|string) => {
  return (time >= 10 ? '' : '0') + time;
};

export const isTimeOverlap: (data: any, currentAppointment: ICurrentAppointment) => boolean =
(data, currentAppointment) => {
  const { date = '', lessonTime = '00:00-00:00' } = currentAppointment;
  if (data[date] && data[date].length > 2) {
    let overlapNum: number = 0;
    const startTime = parseDate(`${date} ${lessonTime.trim().split('-')[0]}`, 'YYYY-MM-DD HH:mm').getTime();
    const endTime = parseDate(`${date} ${lessonTime.trim().split('-')[1]}`, 'YYYY-MM-DD HH:mm').getTime();
    data[date].map(item => {
      if (item.endTime <= startTime || item.startTime >= endTime) {
        return item;
      } else {
        overlapNum++;
        return item;
      }
    });
    if (overlapNum > 1) {
      return true;
    }
  }

  return false;
};

export const getOverLap: (data: any, currentAppointment: ICurrentAppointment, weekStart: number, weekEnd: number) =>
boolean = (data, currentAppointment, weekStart, weekEnd) => {
  const currentDateTime: number = parseDate(currentAppointment.date, 'YYYY-MM-DD').getTime();

  // YZLocalStorage.setItem('appointment_latest_info', JSON.stringify({ id: appointId }));
  return currentDateTime >= weekStart && currentDateTime < weekEnd && isTimeOverlap(data, currentAppointment);
};

export const getHourPlusMinuteFromTime: (time: number) => number = (time) => {
  const date = new Date(time);
  return date.getHours() * 60 + date.getMinutes();
};

export const isTimeinRange: (startTime: number, endTime: number, timeLineStart: number, timeLineEnd: number) =>
boolean = (startTime, endTime, timeLineStart, timeLineEnd) => {
  const startHourPlusMinute = getHourPlusMinuteFromTime(startTime);

  const endHourPlusMinute = getHourPlusMinuteFromTime(endTime);

  return !(endHourPlusMinute < timeLineStart || startHourPlusMinute > timeLineEnd);
};

export const getTimeLineStart: (timeLineStart: string, filterdata: any, interval: number) =>
number = (timeLineStart, filterdata, interval) => {
  let hour = +timeLineStart.split(':')[0];
  let minute = +timeLineStart.split(':')[1];

  const data = { ...filterdata };
  Object.keys(data).map(key => {
    if (data[key] && data[key].length) {
      data[key].map(({ startTime, endTime }) => {
        const start = new Date(startTime).setHours(hour, minute, 0, 0);
        if (startTime < start && endTime > start) {
          hour = new Date(startTime).getHours();
          minute = new Date(startTime).getMinutes();
        }
      });
    }
  });

  if (minute % interval !== 0) {
    minute -= minute % interval;
  }

  return hour * 60 + minute;
};

export const getTimeLineEnd: (timeLineEnd: string, filterdata: any, interval: number) =>
number = (timeLineEnd, filterdata, interval) => {
  let hour = +timeLineEnd.split(':')[0];
  let minute = +timeLineEnd.split(':')[1];

  const data = { ...filterdata };
  // data.sort((a, b) => (a.endTime >= b.endTime ? 1 : -1));

  Object.keys(data).map(key => {
    // data[key].map(({ startTime, endTime }) => {
    if (data[key] && data[key].length) {
      data[key].map(({ startTime, endTime }) => {
        const end = new Date(endTime).setHours(hour, minute, 0, 0);
        if (startTime < end && endTime > end) {
          hour = new Date(endTime).getHours();
          minute = new Date(endTime).getMinutes();
        }
      });
    }
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

export const getFirstTimeline: (data: any, timeLineStart: number, timeLineEnd: number) =>
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
