/* eslint-disable jsdoc/require-returns */
import slice from 'lodash/slice';
import findIndex from 'lodash/findIndex';
import {
  differenceInMonths,
  differenceInYears,
  differenceInCalendarDays,
  subDays,
  addYears,
  addMonths,
} from 'date-fns';

export default function(listConfig, fromOrder = true, isEdit = false) {
  // 需要对年龄和生日的情况做单独处理
  // 如果只配置了年龄：年龄为输入框，支持文本输入
  // 如果只配置了生日：生日为日期选择
  // 如果先配置了年龄，后又新增了生日：年龄输入框禁用，只能通过修改生日自动计算
  // 如果先配置了生日，后又新增了年龄：年龄输入框禁用，只能通过修改生日自动计算
  // 如果同时配置了年龄和生日后，删除了年龄：只能修改生日
  // 如果同时配置了年龄和生日后，删除了生日：年龄输入框由禁用变为可用，支持文本输入
  const birthdayConf = findIndex(listConfig, { attributeKey: 'edu_stuBirth' });
  const ageConf = findIndex(listConfig, { attributeKey: 'edu_stuAge' });
  if (birthdayConf > -1 && ageConf > -1) {
    listConfig[ageConf] = Object.assign({}, listConfig[ageConf], {
      disabled: true,
      readonly: true,
      placeholder: '选择生日后自动计算',
    });
    // 修改当前年龄
    const birthDate = listConfig[birthdayConf].value;
    if (birthDate) {
      listConfig[ageConf].value = getAge(birthDate);
    }
    // 需要在生日改变的时候返回一个对象将年龄一起改变，以避免无限重绘
    listConfig[birthdayConf] = Object.assign({}, listConfig[birthdayConf], {
      valueChange(values) {
        values.edu_stuAge = getAge(values.edu_stuBirth);
        return values;
      },
      maxDate: subDays(new Date(), 0),
    });
  }
  if (fromOrder) {
    return listConfig;
  }

  // 如果是从学生证页面调过来，需要将前三个资料项分组
  const firstGroup = slice(listConfig, 0, 3);
  const lastGroup = slice(listConfig, 3);
  // 插入studentNo（仅做一个标识）和分割行
  const studentNo = isEdit ? 'studentNo' : undefined;
  return firstGroup.concat(studentNo, 'divide', lastGroup);
}

/**
 * 获取多少岁
 * 产品需求：年龄=[0,4)岁的学员，年龄显示精准到几岁几个月；4岁及以上的学员，可以只显示几岁。
 * 计算思路：先算出相隔年数；然后给生日加上对应的年数后，计算相隔的月数；然后给生日加上对应的月数后，计算相隔的天数
 *
 * @param {*} birthday
 */
function getAge(birthday) {
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
    if (yearAge < 1 && monthAge < 1 && dayAge < 1) {
      return '0岁';
    }
    return ageDesc;
  }
}
