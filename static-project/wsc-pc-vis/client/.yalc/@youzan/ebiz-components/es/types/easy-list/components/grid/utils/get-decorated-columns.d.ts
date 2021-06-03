import { IGridColumn } from 'zent';
import { IEasyGridColumn } from '../../../types/grid';
export declare const getDecoratedColumns: (originColumns: IEasyGridColumn<any>[]) => {
    columns: IGridColumn<any>[];
    params: {
        hasLeftFixedCol: boolean;
    };
};
