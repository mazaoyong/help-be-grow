import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

export function getFeedTime(createdAt) {
  const diffYears = differenceInYears(new Date(), createdAt);
  if (diffYears > 0) {
    return `${diffYears}年前`;
  } else {
    const diffMonths = differenceInMonths(new Date(), createdAt);
    if (diffMonths > 0) {
      return `${diffMonths}月前`;
    } else {
      const diffDays = differenceInDays(new Date(), createdAt);
      if (diffDays > 0) {
        return `${diffDays}天前`;
      } else {
        const diffHours = differenceInHours(new Date(), createdAt);
        if (diffHours > 0) {
          return `${diffHours}小时前`;
        } else {
          const diffMinutes = differenceInMinutes(new Date(), createdAt);
          if (diffMinutes > 0) {
            return `${diffMinutes}分钟前`;
          } else {
            const diffSecond = differenceInSeconds(new Date(), createdAt);
            if (diffSecond > 0) {
              return `${diffSecond}秒前`;
            }
          }
        }
      }
    }
  }
};
