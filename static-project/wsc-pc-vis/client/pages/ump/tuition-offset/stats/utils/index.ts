/**
 * 获取某一日期的开始时间
 * @param date YYYY-MM-DD
 */

export function getDateStartTimeStrByDate(date: string) {
  if (!date) {
    return '';
  }
  return date + ' 00:00:00';
};

/**
 * 获取某一日期的结束时间
 * @param date YYYY-MM-DD
 */

export function getDateEndTimeStrByDate(date: string) {
  if (!date) {
    return '';
  }
  return date + ' 23:59:59';
};

// 将dateTimeRange转化为{ joinTimeStart, joinTimeEnd }的格式
export function parseJoinTime(joinTime: string | string[]) {
  if (!joinTime) {
    return {};
  }
  let joinTimeStart = '';
  let joinTimeEnd = '';
  if (typeof joinTime !== 'string') {
    [joinTimeStart, joinTimeEnd] = joinTime;
  }
  return {
    joinTimeStart: getDateStartTimeStrByDate(joinTimeStart),
    joinTimeEnd: getDateEndTimeStrByDate(joinTimeEnd),
  };
}
