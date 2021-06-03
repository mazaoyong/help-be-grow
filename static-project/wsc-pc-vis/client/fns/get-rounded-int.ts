/** 获取四舍五入后的整数
 * （多用于numberinput表单项在未失焦时提交，不会自动被转化为整数而导致tether类型报错的情况）
 * @param value
 * @type number | string
 * @returns Integer
 */

export default function getRoundedInt(value: number | string) {
  const numberVal = Number(value);
  if (!numberVal) {
    throw Error('格式错误');
  }
  return Number(numberVal.toFixed(0));
}
