/**
 * @param {number} count 需要省略的数字
 */
export const ellipsisWord = (word, count) => {
  if (typeof word === 'string') {
    const needWrap = word.length >= count;
    return needWrap ? `${word.substr(0, count)}...` : word;
  }
  return word;
};
