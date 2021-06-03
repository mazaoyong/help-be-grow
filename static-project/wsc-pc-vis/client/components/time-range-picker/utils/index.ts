import { startOfYear, differenceInWeeks } from 'date-fns';

// 获取时间在一年的第几周
export const getWeekOfYear = (date: Date | string | number) => {
  return differenceInWeeks(date, startOfYear(date)) + 1;
};

export const safeToNumber = (value?: number | string) => {
  return isNaN(Number(value)) ? undefined : Number(value);
};

/**
 * 设置时间为当天开始
 *
 * @param date 日期对象 | 时间戳
 */
export const setToDayStartTime = (date: Date | number): Date => {
  return new Date(
    new Date(date).setHours(0, 0, 0, 0)
  );
};

/**
 * 设置时间为当天结束
 *
 * @param date 日期对象 | 时间戳
 */
export const setToDayEndTime = (date: Date | number): Date => {
  return new Date(
    new Date(date).setHours(23, 59, 59, 999)
  );
};
