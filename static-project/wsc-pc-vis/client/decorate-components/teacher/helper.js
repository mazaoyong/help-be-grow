/**
 * check state
 * @param {array} arr
 * @param {any} key
 * @returns {boolean}
 */
export function getCheckBoxState(arr, key) {
  return arr.indexOf(key) > -1;
}

/**
 * check value
 * @param arr
 * @param key
 * @returns {string}
 */
export function getCheckBoxValue(arr, key) {
  return arr.indexOf(key) > -1 ? '显示' : '不显示';
}
