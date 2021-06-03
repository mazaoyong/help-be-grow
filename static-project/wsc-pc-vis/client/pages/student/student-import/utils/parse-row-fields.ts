import { selectFields, ebizSelectFields, dateFields } from '../constants';

function checkTimeValid(timeStr) { // 日期支持 YYYY/MM/DD 和 YYYY-MM-DD 两种类型
  return /(^\d{1}|^\d{2}|^\d{3}|^\d{4})\-(\d{1}|\d{2})\-(\d{1}|\d{2})$/.test(timeStr) ||
  /(^\d{1}|^\d{2}|^\d{3}|^\d{4})\/(\d{1}|\d{2})\/(\d{1}|\d{2})$/.test(timeStr);
};

function validTimeParse(timeStr) {
  if (checkTimeValid(timeStr)) {
    let validTimeStr = timeStr.replace(/\//g, '-');
    if (validTimeStr // 如果年月日中有0
      .split('-')
      .map(time => parseInt(time))
      .includes(0)
    ) {
      return '';
    }
    return validTimeStr;
  } else {
    return '';
  }
};

// 把easyform格式的导入行信息转化为后端所用的格式
export function formRowFields(fields) {
  if (!fields) return;
  const rowFields = Object.keys(fields)
    .filter(item => (item !== 'period' && item !== 'validDate'))
    .map(item => {
      if (fields && Array.isArray(fields[item]) && fields[item].length === 1) { // select组件默认返回array
        const value = fields[item][0];
        return {
          name: item,
          value,
        };
      }
      return {
        name: item,
        value: fields[item],
      };
    });
  if (fields.period) {
    rowFields.push({
      name: 'totalCourseTime',
      value: fields.period[1],
    });
    rowFields.push({
      name: 'availableCourseTime',
      value: fields.period[0],
    });
  };
  if (fields.validDate) {
    rowFields.push({
      name: 'validStartTime',
      value: fields.validDate[0],
    });
    rowFields.push({
      name: 'validEndTime',
      value: fields.validDate[1],
    });
  };

  return rowFields;
};

// 把后端传来的行信息转化成easyform格式的行信息
export function parseRowFields(fields) {
  if (!fields) return;
  const filterKeys = ['totalCourseTime', 'availableCourseTime', 'validStartTime', 'validEndTime'];
  const rowFields = Object.keys(fields)
    .filter(item => !filterKeys.includes(item))
    .map(item => {
      if (fields && ebizSelectFields.includes(item)) {
        if (fields[item].rowFieldValidateInfo) {
          // 如果select格式的字段错误，展示为空
          return {
            name: '',
            value: '',
          };
        }
        // select组件默认返回array
        return {
          name: item,
          value: [fields[item].value],
        };
      } else if (fields && selectFields.includes(item)) {
        if (fields[item].rowFieldValidateInfo) {
          // 如果select格式的字段错误，展示为空
          return {
            name: '',
            value: '',
          };
        }
        // select组件默认返回array
        return {
          name: item,
          value: fields[item].value,
        };
      } else if (fields && dateFields.includes(item)) {
        if (fields[item].rowFieldValidateInfo) {
          // 如果日期组件错误，值设为空
          return {
            name: '',
            value: '',
          };
        }
      } else if (fields && item === 'enrollTime') {
        return { // 把报名时间YYYY/MM/DD转化为YYYY-MM-DD格式
          name: item,
          value: validTimeParse(fields[item].value),
        };
      }
      return {
        name: item,
        value: fields[item].value,
      };
    });
  if (fields.totalCourseTime && fields.availableCourseTime) {
    rowFields.push({
      name: 'period',
      value: [fields.availableCourseTime.value, fields.totalCourseTime.value],
    });
  };
  if (fields.validStartTime && fields.validEndTime) {
    rowFields.push({
      name: 'validDate',
      value: [validTimeParse(fields.validStartTime.value), validTimeParse(fields.validEndTime.value)],
    });
  };
  return rowFields;
};
