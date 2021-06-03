import { ISortData } from './sortdata';

/**
 * 对时间校验，是否符合 "08:00" 的格式
 * @param timeStr 时间字符串，eg: "08:00"
 */
const validateTimeLine = (timeStr: string) => {
  return /^\d{1,2}:\d{2}$/.test(timeStr);
};

/**
 * 时间字符串转为从零点开始的分钟数
 * @param timeStr - 时间字符串 eg: "08:00"
 * @example 08:20 -> 8 * 60 + 20 = 500
 */
const getTimelineMinutes = (timeStr: string) => {
  const tmp = timeStr.split(':').map(v => parseInt(v, 10));
  return tmp[0] * 60 + tmp[1];
};

/**
 * 获取时间间隔列表
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param interval - 时间间隔
 * @returns 时间列表
 */
export const getTimeLineList = (
  timeLineStart: string,
  timelineEnd: string,
  interval: number
) => {
  // 校验 timelineStart
  if (!validateTimeLine(timeLineStart)) {
    timeLineStart = '00:00';
    console.error(
      `error with timelineStart: ${timeLineStart}，default start with "00:00"`
    );
  }

  // 校验 timeLineEnd
  if (!validateTimeLine(timelineEnd)) {
    timelineEnd = '24:00';
    console.error(
      `error with timelineEnd: ${timelineEnd}，default start with "24:00"`
    );
  }

  const startTime: number = getTimelineMinutes(timeLineStart);
  const endTime: number = getTimelineMinutes(timelineEnd);

  // 校验 interval
  if (
    interval > endTime - startTime ||
    (startTime - endTime) % interval !== 0
  ) {
    interval = 15;
    console.error('interval is too big，or can not diveded');
  }

  const total = endTime - startTime;

  return Array(total / interval)
    .fill(0)
    .map((_, i) => interval * i + startTime);
};

const paddingTime = (time: number|string) => {
  return (time >= 10 ? '' : '0') + time;
};

export const getTimeLineStart = (timeLineStart: string, data: ISortData[], interval: number) => {
  let hour = +timeLineStart.split(':')[0];
  let minute = +timeLineStart.split(':')[1];

  data = data.sort((a, b) => (a.startTime >= b.startTime ? 1 : -1));

  data.map(({ startTime, endTime }) => {
    const start = new Date(startTime).setHours(hour, minute, 0, 0);
    if (startTime < start && endTime > start) {
      hour = new Date(startTime).getHours();
      minute = new Date(startTime).getMinutes();
    }
  });
  if (minute % interval !== 0) {
    minute -= minute % interval;
  }

  return `${paddingTime(hour)}:${paddingTime(minute)}`;
};

export const getTimeLineEnd = (timeLineEnd: string, data: ISortData[], interval: number) => {
  let hour = +timeLineEnd.split(':')[0];
  let minute = +timeLineEnd.split(':')[1];

  data = data.sort((a, b) => (a.endTime >= b.endTime ? 1 : -1));

  data.map(({ startTime, endTime }) => {
    const end = new Date(endTime).setHours(hour, minute, 0, 0);
    if (startTime < end && endTime > end) {
      hour = new Date(endTime).getHours();
      minute = new Date(endTime).getMinutes();
    }
  });
  if (minute % interval !== 0) {
    minute = Math.ceil(minute / interval) * interval;
    if (minute % 60 === 0) {
      hour += 1;
      minute = 0;
    }
  }

  return `${paddingTime(hour)}:${paddingTime(minute)}`;
};

/**
 * 分钟数转为时间字符串
 * @param time 零点开始分钟数
 * @example 500 -> "08:00"
 */
export const getTimeString = (time: number) => {
  let h = Math.floor(time / 60);
  let m = Math.floor(time % 60);

  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
};
