/**
 * 验证输入是否为非负整数，只验证最终输入值，即`1.00`=1,`.0`=0,`1.`=1等输入会被认为是合法输入
 *
 * @param {string} value 输入值
 * @return {string} 验证结果
 */
export function nonnegaIntValidator(value: string) {
  const num = Number(value);
  if (Number.isInteger(num) && num >= 0) return '';
  return '请输入大于等于0的整数';
}
