import { differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears } from 'date-fns';

/**
 * 根据生日计算年龄
 *
 * @param birthday - 出生日期
 * @return {string} - 年龄
 */
export default function getAgeByBirthday(birthday: number | string | Date): string {
  const days = differenceInCalendarDays(new Date(), birthday);
  const months = differenceInCalendarMonths(new Date(), birthday);
  const years = differenceInCalendarYears(new Date(), birthday);

  if (months < 1) {
    return `${days}天`;
  } else if (months < 12) {
    return `${months}个月`;
  } else {
    return `${years}岁`;
  }
}
