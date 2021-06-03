import { parse, format } from 'date-fns';

const FORMAT_STR = 'YYYY/MM/DD 00:00:00';
const oneDay = 24 * 60 * 60 * 1000;

// 获取今天距离开始日期还有几天
function getDays(startDate: Date | string | number): number {
  const now = new Date();
  const parsedStartDate = parse(format(startDate, FORMAT_STR));
  const timestampDistance = parsedStartDate.getTime() - now.getTime();
  if (timestampDistance > 0) {
    const accuracyRes = timestampDistance / oneDay;
    return accuracyRes > 1 ? Math.ceil(accuracyRes) : Math.floor(accuracyRes);
  }
  return 0;
}

// 获取数据的递减初值
function getInitSeconds(startDate: Date | string | number): number {
  const now = new Date();
  const parsedStartDate = parse(format(startDate, FORMAT_STR));
  const timestampDistance = parsedStartDate.getTime() - now.getTime();
  return timestampDistance || 0;
}

function getHours(timestamp: number): number {
  return Math.floor(timestamp / (60 * 60 * 1000));
}

function getMins(timestamp: number): number {
  return Math.floor(timestamp / (60 * 1000) % 60);
}

function getSecs(timestamp: number): number {
  return Math.floor((timestamp / 1000) % 60);
}

export {
  getDays,
  getInitSeconds,
  getHours,
  getMins,
  getSecs,
};
