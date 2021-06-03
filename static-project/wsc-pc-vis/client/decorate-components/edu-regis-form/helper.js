/**
 * check state
 * @param {array} arr
 * @param {any} item
 * @returns {boolean}
 */
export function getCheckBoxState(arr, item) {
  return arr.some(it => it.itemId === item.itemId);
}

/**
 * check value
 * @param arr
 * @param item
 * @returns {string}
 */
export function getCheckBoxValue(arr, item) {
  return getCheckBoxState(arr, item) ? '显示' : '不显示';
}
