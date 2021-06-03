/**
 * 验证金额是0~99999.99之间的数值
 *
 * @param {string} value 输入值
 * @return {string} 验证结果
 */
export function priceValidator(value: string) {
  const num = Number(value);
  if (isNaN(num)) return '请输入数字';
  if (num < 0) return '价格必须大于等于0元';
  if (num > 99999.99) return '价格必须小于等于99999.99元';

  const arr = value.toString().split('.');
  if (arr && arr[1] && arr[1].length > 2) return '价格请保留2位小数';
  return '';
};

/**
 * 验证金额是0~99999.99之间的数值
 *
 * @param {string} value 输入值
 * @return {string} 验证结果
 */
export function titleValidator(value: string) {
  if (!value) return '标题不能为空';
  return '';
};
