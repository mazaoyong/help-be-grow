import formatDate from 'zan-utils/date/formatDate';

/**
 * 获取一天的所有刻度（间隔是十五分钟）
 */
export const genQuarterAllDay = () => {
  const quarters = [];
  const allDayMinute = 24 * 60;
  let minute = 0;
  while (minute < allDayMinute) {
    quarters.push(formatMinutesToHHMM(minute));
    minute += 15;
  }
  return quarters;
};

/**
 * 格式化分钟为HH:mm格式
 */
export const formatMinutesToHHMM = minutes => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${paddingFrontZero(hour, 2)}:${paddingFrontZero(minute, 2)}`;
};

/**
 * 前置补零
 */
export const paddingFrontZero = (data, digitNum) => {
  data = new Array(digitNum).fill(0).join('') + data;
  return data.slice(-2);
};

/**
 * 获取当天开始的毫秒值，支持偏移量以及指定时间
 */
export const getMilliSecond = (offset = 0, date) => {
  if (!date) date = new Date(formatDate(new Date(), 'YYYY/MM/DD') + ' 00:00:00');
  return +new Date(date) + offset * 24 * 60 * 60 * 1000;
};

/**
 * 移除对象中空字符串字段
 * todo 暂时只处理表层，深层次暂不做处理
 *
 * @param {Object} obj 对象
 */
export const deleteEmptyProperty = (obj = {}) => {
  const temp = Object.assign({}, obj);
  for (const key in temp) {
    if (temp[key] === '' || temp[key] === null || temp[key] === undefined) {
      delete temp[key];
    }
  }

  return temp;
};

// 获取默认值
export const getDefaultText = (value, defaultValue) => {
  if (value === 0) return value;
  return value || defaultValue || '-';
};

// 获取本月的最后一天
export const getCurrentMonthLastDay = () => {
  const current = new Date();
  const currentMonth = current.getMonth();
  const nextMonth = currentMonth + 1;

  const nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);

  const minusDate = 1000 * 60 * 60 * 24;

  return new Date(nextMonthDayOne.getTime() - minusDate);
};

// 获取指点月份的天数
export const getMonthDays = (year, month) => {
  const thisDate = new Date(year, month, 0);
  return thisDate.getDate();
};
