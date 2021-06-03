import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

/**
 * 获取相对时间，如 几秒前 几年前
 *
 * @param {number|string} inputTime - 输入时间
 * @param {boolean} displaySecond - 是否显示几秒前
 * @return {string} 格式化好的相对时间字符串
 */
export default function getRelativeTime(inputTime: number, displaySecond:boolean = false): string {
  const diffYears = differenceInYears(new Date(), inputTime);
  if (diffYears > 0) {
    return `${diffYears}年前`;
  } else {
    const diffMonths = differenceInMonths(new Date(), inputTime);
    if (diffMonths > 0) {
      return `${diffMonths}月前`;
    } else {
      const diffDays = differenceInDays(new Date(), inputTime);
      if (diffDays > 0) {
        return `${diffDays}天前`;
      } else {
        const diffHours = differenceInHours(new Date(), inputTime);
        if (diffHours > 0) {
          return `${diffHours}小时前`;
        } else {
          const diffMinutes = differenceInMinutes(new Date(), inputTime);
          if (diffMinutes > 0) {
            return `${diffMinutes}分钟前`;
          } else {
            if (!displaySecond) {
              return '刚刚';
            }
            const diffSecond = differenceInSeconds(new Date(), inputTime);
            if (diffSecond > 0) {
              return `${diffSecond}秒前`;
            }
          }
        }
      }
    }
  }
  return '';
};
