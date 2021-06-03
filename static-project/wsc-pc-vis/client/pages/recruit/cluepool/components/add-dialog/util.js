import {
  differenceInMonths,
  differenceInYears,
  differenceInCalendarDays,
  addYears,
  addMonths,
} from 'date-fns';

/**
 * 获取多少岁
 * 产品需求：年龄=[0,4)岁的学员，年龄显示精准到几岁几个月；4岁及以上的学员，可以只显示几岁。
 * 计算思路：先算出相隔年数；然后给生日加上对应的年数后，计算相隔的月数；然后给生日加上对应的月数后，计算相隔的天数
 *
 * @param {*} birthday
 * @return {String}
*/
export function formatBirthday(birthday) {
  if (!birthday) {
    return '';
  }

  const now = new Date();
  const yearAge = differenceInYears(now, birthday);
  if (yearAge >= 4) {
    return `${yearAge}岁`;
  } else {
    const afterAddYears = addYears(birthday, yearAge);
    const monthAge = differenceInMonths(now, afterAddYears);
    const afterAddMonths = addMonths(afterAddYears, monthAge);
    const dayAge = differenceInCalendarDays(now, afterAddMonths);
    let ageDesc = '';
    if (yearAge >= 1) {
      ageDesc = `${yearAge}岁`;
    }

    if (monthAge >= 1) {
      ageDesc += `${monthAge}个月`;
    }
    if (yearAge < 1 && monthAge < 1 && dayAge >= 1) {
      ageDesc += `${dayAge}天`;
    }
    return ageDesc;
  }
}
