import { ISortData } from './sortdata';
/**
 * 获取时间间隔列表
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param interval - 时间间隔
 * @returns 时间列表
 */
export declare const getTimeLineList: (timeLineStart: string, timelineEnd: string, interval: number) => number[];
export declare const getTimeLineStart: (timeLineStart: string, data: ISortData[], interval: number) => string;
export declare const getTimeLineEnd: (timeLineEnd: string, data: ISortData[], interval: number) => string;
/**
 * 分钟数转为时间字符串
 * @param time 零点开始分钟数
 * @example 500 -> "08:00"
 */
export declare const getTimeString: (time: number) => string;
