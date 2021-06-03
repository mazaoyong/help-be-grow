import {
  startOfWeek,
  endOfToday,
  format,
  addWeeks,
  endOfWeek,
  addDays,
  startOfDay,
  startOfToday,
  endOfDay,
} from 'date-fns';
import qs from 'qs';
import { REFUNDTYPE } from './constants';
export const getCurrentWeek = () => {
  const nowDays = new Date();
  const startDate = formatDate(startOfWeek(nowDays));
  const endDate = formatDate(endOfToday());
  return [startDate, endDate];
};
export const getLastWeek = () => {
  const nowDays = new Date();
  const lastWeekDay = addWeeks(nowDays, -1);
  const startDate = formatDate(startOfWeek(lastWeekDay));
  const endDate = formatDate(endOfWeek(lastWeekDay));
  return [startDate, endDate];
};
export const getToday = () => {
  const startDate = formatDate(startOfToday());
  const endDate = formatDate(endOfToday());
  return [startDate, endDate];
};
export const getTomorrow = () => {
  const nowDays = new Date();
  const tomorrow = addDays(nowDays, 1);
  const startDate = formatDate(startOfDay(tomorrow));
  const endDate = formatDate(endOfDay(tomorrow));
  return [startDate, endDate];
};
function formatDate(tDate) {
  return format(tDate, 'YYYY-MM-DD HH:mm:ss');
}

export const getUnitByType = type => {
  let unit = '';
  switch (type) {
    case REFUNDTYPE.BY_COURSE:
      unit = '课时';
      break;
    case REFUNDTYPE.BY_TIMEPERIOD:
      unit = '天';
      break;
    case REFUNDTYPE.BY_PHASE:
      unit = '节课';
      break;
    case REFUNDTYPE.BY_CUSTOM:
      unit = '天';
      break;
  }
  return unit;
};

// 获取location.search
export const getLocationSearch = () => {
  const { href } = window.location;
  if (href.indexOf('?') > -1) {
    let search = href.slice(href.indexOf('?') + 1);
    if (search.indexOf('#') > -1) {
      search = search.slice(0, search.indexOf('#'));
    }
    return qs.parse(search);
  }
  return {};
};

// 是否是0元
export const isZeroValue = (value) => {
  return typeof value === 'number' && value === 0;
};

// 处理当金额为0时候的显示
export const formatTextWithZeroValue = (value, normalText) => {
  return isZeroValue(value) ? '-' : normalText;
};
