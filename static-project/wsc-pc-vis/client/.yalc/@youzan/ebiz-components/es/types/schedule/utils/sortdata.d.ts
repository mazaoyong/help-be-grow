/**
 * 对一天内的日程进行排序，转变为一个二维数组
 *
 * 将日程按照 startTime 进行排序
 * 对每一个日程进行遍历，将其与而为数组的每一行的最后一个的 endTime 对比
 * 如果大于或等于 endTime 则将其 push 进该行，
 * 如果小如 endTime，则与下一行对比，都不匹配，怎新加一行并 push
 */
export interface ISortData {
    startTime: number;
    endTime: number;
    overlap?: boolean;
    resourceName?: string;
    [key: string]: any;
}
declare const sortData: (data: ISortData[]) => ISortData[][];
export default sortData;
