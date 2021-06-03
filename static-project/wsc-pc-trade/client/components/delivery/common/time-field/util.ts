import {
  ITimeBucket,
  Mode,
  ITimeRange,
  ITimeValue,
  IWeekTimeRange,
  IBusinessHour,
} from 'definitions/delivery-time';

import { BusinessHour } from '@youzan/react-components';
import { get, padStart } from 'lodash';

export const getTimeString = (time: ITimeValue) => {
  const { hour, minute } = time;
  return `${padStart(String(hour), 2, '0')}:${padStart(String(minute), 2, '0')}`;
};

export const getHourMinute = time => {
  if (time) {
    let [hour, minute] = time.split(':');
    hour = Number(hour);
    minute = Number(minute);
    return {
      hour,
      minute,
    };
  }
  return {
    hour: 0,
    minute: 0,
  };
};

const getDays = (str: string, key: string) => {
  // '1100111' => [1, 2, 5, 6, 0]
  const result: number[] = [];
  const s = str.split('');
  s.forEach((c, i) => {
    if (c === key) {
      result.push((i + 1) % 7);
    }
  });
  return result;
};

export const formatTimes = (times: IBusinessHour): ITimeBucket[] => {
  const mode = get(times, 'mode', Mode.FULLTIME);
  const dailyValue = get(times, 'dailyValue', [] as ITimeRange[]);
  const weeklyValue = get(times, 'weeklyValue', [] as IWeekTimeRange[]);
  if (mode === Mode.FULLTIME) {
    return [
      {
        switchs: '1111111',
        startTime: '00:00',
        endTime: '23:59',
        timeRangeType: 1,
      },
    ];
  } else if (mode === Mode.DAILY_REPEAT) {
    return dailyValue.map(time => {
      return {
        switchs: '1111111',
        startTime: getTimeString(time.start),
        endTime: getTimeString(time.end),
        timeRangeType: 2,
      };
    });
  } else if (mode === Mode.WEEKLY_REPEAT) {
    const timeBuckets: ITimeBucket[] = [];
    weeklyValue.forEach(weekTimeRange => {
      const switchsArr = ['0', '0', '0', '0', '0', '0', '0'];
      weekTimeRange.days.forEach(day => {
        switchsArr[(day + 6) % 7] = '1';
      });
      weekTimeRange.times.forEach(time => {
        timeBuckets.push({
          switchs: switchsArr.join(''),
          startTime: getTimeString(time.start),
          endTime: getTimeString(time.end),
          timeRangeType: 3,
        });
      });
    });
    return timeBuckets;
  }
  return [
    {
      switchs: '1111111',
      startTime: '00:00',
      endTime: '23:59',
      timeRangeType: 1,
    },
  ];
};

export const formatTimeBuckets = (timeBuckets: ITimeBucket[]) => {
  if (!timeBuckets || !timeBuckets.length) {
    timeBuckets = [
      {
        switchs: '1111111',
        startTime: '00:00',
        endTime: '23:59',
        timeRangeType: 1,
      },
    ];
  }
  const mode = get(timeBuckets, '[0].timeRangeType', Mode.FULLTIME);
  let dailyValue = [BusinessHour.makeTimeRange()];
  let weeklyValue;
  if (mode === Mode.FULLTIME || mode === Mode.DAILY_REPEAT) {
    dailyValue = timeBuckets.map(bucket => {
      return {
        id: `${bucket.startTime}-${bucket.endTime}`,
        start: getHourMinute(bucket.startTime),
        end: {
          date: 'today',
          ...getHourMinute(bucket.endTime),
        },
      };
    });
  } else if (mode === Mode.WEEKLY_REPEAT) {
    const timeBucketsMap = {};
    timeBuckets.forEach(bucket => {
      const switchs = bucket.switchs;
      if (!timeBucketsMap[switchs]) {
        timeBucketsMap[switchs] = [bucket];
      } else {
        timeBucketsMap[switchs].push(bucket);
      }
    });
    weeklyValue = Object.keys(timeBucketsMap).map((switchs, index) => {
      const buckets = timeBucketsMap[switchs];
      return {
        id: index,
        days: getDays(switchs, '1'),
        times: buckets.map(bucket => {
          return {
            id: `${bucket.startTime}-${bucket.endTime}`,
            start: getHourMinute(bucket.startTime),
            end: {
              date: 'today',
              ...getHourMinute(bucket.endTime),
            },
          };
        }),
      };
    });
  }
  return {
    mode,
    dailyValue: dailyValue || [],
    weeklyValue: weeklyValue || [],
  };
};
