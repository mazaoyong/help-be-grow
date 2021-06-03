import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import find from 'lodash/find';

/**
 * 获取第一个校验错误的design组件
 *
 * @param {*} errors 报错信息
 * @return {*} firstError 第一个报错信息
 */
export default function getFirstDesignError(errors) {
  if (!errors) {
    return '';
  }

  if (isString(errors)) {
    return errors;
  }

  const firstErrorMap = find(errors, err => err && Object.keys(err).length > 0);
  const firstError = firstErrorMap[Object.keys(firstErrorMap)[0]];

  if (isArray(firstError)) {
    if (isString(firstError[0])) {
      return find(firstError, item => item !== '');
    }
    return firstError[0][Object.keys(firstError[0])[0]];
  }
  return firstError;
}
