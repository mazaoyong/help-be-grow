import { allOptionId, dateNow } from './constants';
import { ITimeRange } from './types';
/**
 * 安全转换为数值类型
 *
 * @param {any} originalValue 原始数值
 * @return {number} 转换后数据
 */
export const safeToNumber: (any) => number | undefined = (originalValue: any) => {
  const assetVal: number = +originalValue;
  if (isNaN(assetVal) || assetVal === 0) {
    return undefined;
  }
  return assetVal;
};

/**
 * 过滤掉null或undefined数据
 *
 * @param {Object} obj 对象
 * @return {undefined} 无
 */
export const filterNilValue: (any) => void = obj => {
  for (let key of Object.keys(obj)) {
    if (obj[key] == null) {
      delete obj[key];
    }
  }
};

/**
 * 过滤包含全部类型的ID值
 *
 * @param {number} val
 * @return {number} ID
 */
export const formatId: (number) => number | null = (val: number) => {
  if (val === allOptionId) {
    return null;
  }
  return val;
};

/**
 * 设置时间日期
 *
 * @param {Date} date 日期
 * @param {string} timeFormat example : '23:59:59.999'
 * @return {Date} 日期
 */
export const setDateTime: (Date, string) => Date = (date: Date, timeFormat: string) => {
  const timeArr = timeFormat.split(/:|\./).map(item => parseInt(item));
  timeArr[0] != null && date.setHours(timeArr[0]);
  timeArr[1] != null && date.setMinutes(timeArr[1]);
  timeArr[2] != null && date.setSeconds(timeArr[2]);
  timeArr[3] != null && date.setMilliseconds(timeArr[3]);
  return date;
};

/**
 * 获取月份的开始和结束时间戳
 *
 * @param {boolean} current 是否是当前月份
 * @param {number} year 年
 * @param {number} month 月
 * @return {ITimeRange} 开始结束时间
 */
export const getMonthRangeTime: (current: boolean, year?: number, month?: number) => ITimeRange = (
  current,
  year,
  month,
) => {
  const currentYear = dateNow.getFullYear();
  const currentMonth = dateNow.getMonth();

  const cy = current ? currentYear : year;
  const cm = current ? currentMonth : month;
  if (typeof cy === 'undefined' || typeof cm === 'undefined') {
    throw new Error('invalid params');
  }
  const dateStart = new Date(cy, cm, 1);
  const dateEnd = new Date(cy, cm + 1, 0);
  setDateTime(dateEnd, '23:59:59.000');
  return {
    startTime: dateStart.getTime(),
    endTime: dateEnd.getTime(),
  };
};
