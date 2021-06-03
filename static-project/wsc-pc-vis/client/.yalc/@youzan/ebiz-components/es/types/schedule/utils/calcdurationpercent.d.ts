/**
 * 计算两个时间占一天的比重
 * @param startTime 开始时间戳
 * @param endTime 结束时间戳
 * @example
 * const startTime = new Date('2019-03-05 12:00:00').getTime();
 * const endTime = new Date('2019-03-05 18:00:00').getTime();
 * calcDurationPercent(startTime, endTime) => 0.25
 */
declare const calcDurationPercent: (startTime: number, endTime: number, duration?: number) => number;
export default calcDurationPercent;
