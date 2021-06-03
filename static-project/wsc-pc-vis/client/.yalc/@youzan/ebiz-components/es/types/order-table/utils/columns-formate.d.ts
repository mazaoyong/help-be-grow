import { orderTableCols } from '../types';
export interface IFormatedCols {
    headKeys: string[];
    bodyKeys: string[];
    columns: orderTableCols;
}
/** 这个方法用于格式化columns属性，并抽取出其中用于渲染到每一行头部的key */
export default function fromateColumns(columns: orderTableCols): IFormatedCols;
