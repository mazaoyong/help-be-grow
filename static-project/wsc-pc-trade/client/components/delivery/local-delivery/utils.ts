import padStart from 'lodash/padStart';

/**
 * start pad args fix version
 */
export function padLeft(source: number | string, len = 2, char = '0') {
  return padStart(String(source), len, char);
}

/**
 * 比较版本号
 *
 * @param {string} v1
 * @param {string} v2
 * @returns
 * @memberof Board
 */
export function versionCompare(v1: string, v2: string) {
  const v1Arr = v1 ? v1.split('.').map(n => +n) : [];
  const v2Arr = v2 ? v2.split('.').map(n => +n) : [];
  const v1Len = v1Arr.length;
  const v2Len = v2Arr.length;

  const tmp = v1Len < v2Len ? v1Arr : v2Arr;
  const digit = Math.abs(v2Len - v1Len);

  // 补齐版本号位数（1.0 和 1.0.0）
  for (let i = 0; i < digit; i++) {
    tmp.push(0);
  }

  for (let i = 0; i < v1Arr.length; i++) {
    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    }
    if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }
  }

  return 0;
}

/**
 * 加小数点，解决toFixed的四舍五入在不同浏览器下有不同的结果
 * @param {Number} value
 * @param {Number} decimal
 */
export function setToFixed(value, decimal) {
  return (Math.round(value * 10 ** decimal) / 10 ** decimal).toFixed(decimal);
}

/**
 * 判断给定的值是否是数字
 * @param {Number} value
 */
export function isNumber(value) {
  return (
    /^(-|\+)?\d+(\.)?$/g.test(value) ||
    /^(-|\+)?\d+(\.\d+)?$/g.test(value) ||
    /^\d+\.$/g.test(value) ||
    /^(-|\+)?$/g.test(value)
  );
}
