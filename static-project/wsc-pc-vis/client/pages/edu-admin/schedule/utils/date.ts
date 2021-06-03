import { startOfYear, differenceInWeeks } from 'date-fns';

// 获取时间在一年的第几周
export const getWeekOfYear = (date: Date | string | number) => {
  return differenceInWeeks(date, startOfYear(date)) + 1;
};
