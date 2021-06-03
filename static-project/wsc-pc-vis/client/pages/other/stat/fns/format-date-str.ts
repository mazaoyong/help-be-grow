import differenceInCalendarWeeks from 'date-fns/difference_in_calendar_weeks';
import endOfWeek from 'date-fns/end_of_week';
import startOfWeek from 'date-fns/start_of_week';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

/**
 * 按周格式化时间字符串
 *
 * @param {Date} date - 时间Date对象
 * @param {string} noDay - 是否展示周日期
 * @return {string} 输出时间字符串
 */
export function getWeekStr(date: Date, noDay: boolean): string {
  const end = parse(date);
  const year = endOfWeek(end, { weekStartsOn: 1 }).getFullYear();
  const start = startOfWeek(parse(`${year}-01-01`), { weekStartsOn: 1 });
  const weekIndex = differenceInCalendarWeeks(end, start, { weekStartsOn: 1 }) + 1;
  const weekStart = format(startOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  const weekEnd = format(endOfWeek(end, { weekStartsOn: 1 }), 'MM-DD');
  return `${year}第${weekIndex}周${noDay ? '' : `（${weekStart} ~ ${weekEnd}）`}`;
};

/**
 * 按天，周，月格式化时间字符串
 *
 * @param {string} item - 要判断的时间字符串, 格式为"YYYYMMDD"或"YYYY-MM-DD"
 * @param {string} dateType - 1: 天; 2: 周; 3: 月
 * @return {string} 输出时间字符串
 */
export default function(item: string, dateType: string): string {
  let currentDay = item;
  if (currentDay.indexOf('-') === -1) {
    currentDay = `${currentDay.substring(0, 4)}-${currentDay.substring(4, 6)}-${currentDay.substring(
      6
    )}`;
  }

  const date = new Date(currentDay);
  if (dateType === '1') {
    return currentDay;
  } else if (dateType === '2') {
    return getWeekStr(date, true);
  } else if (dateType === '3') {
    return format(date, 'YYYY-MM');
  }
  return currentDay;
};
