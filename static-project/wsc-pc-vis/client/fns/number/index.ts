import accDiv from 'zan-utils/number/accDiv';

/**
 * 单位转换函数
 * @param params
 * @param params.value 需要转换的值
 * @param params.divisor 转换倍数
 * @param params.fixed 需要保留的小数位数
 */

export default function unitConversion(params: {
  value?: number;
  divisor: number;
  fixed?: number;
}) {
  let { value, divisor, fixed } = params;
  if (typeof value !== 'number' || isNaN(value)) {
    value = 0;
  }
  return typeof fixed === 'number' ? accDiv(value, divisor).toFixed(fixed) : accDiv(value, divisor);
}
