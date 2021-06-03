import slice from 'lodash/slice';
import findIndex from 'lodash/findIndex';
import { differenceInCalendarMonths, differenceInCalendarYears, differenceInCalendarDays } from 'date-fns';

// 获取多少岁
function getAge(birthday) {
  const now = new Date();
  const yearAge = differenceInCalendarYears(now, birthday);
  if (yearAge >= 1) {
    return `${yearAge}岁`;
  }
  const monthAge = differenceInCalendarMonths(now, birthday);
  if (monthAge >= 1) {
    return `${monthAge}个月`;
  }
  const dayAge = differenceInCalendarDays(now, birthday);
  if (dayAge >= 1) {
    return `${dayAge}天`;
  } else {
    return '0岁';
  }
}

export default function(listConfig, showSource = false) {
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
    // 需要在生日改变的时候返回一个对象将年龄一起改变
    listConfig[birthdayConf] = Object.assign({}, listConfig[birthdayConf], {
      onValueChanged(value) {
        return {
          'edu_stuBirth': value,
          'edu_stuAge': getAge(value),
        };
      },
    });
  }

  // 如果是从学生证页面调过来，需要将前三个资料项分组
  const firstGroup = slice(listConfig, 0, 2);
  const lastGroup = slice(listConfig, 2);

  if (!showSource) {
    return firstGroup.concat('divide', lastGroup, 'divide');
  }
  // 插入studentNo和分割行
  return firstGroup.concat('divide', lastGroup, 'divide', 'source');
}
