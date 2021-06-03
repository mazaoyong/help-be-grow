/**
 * 判断是否为今天
 *
 * @param {number | string| Date} date - 要判断的日期
 * @return {boolean}
 */
export default (date: number | string | Date) => {
  return new Date(date).toDateString() === new Date().toDateString();
};
