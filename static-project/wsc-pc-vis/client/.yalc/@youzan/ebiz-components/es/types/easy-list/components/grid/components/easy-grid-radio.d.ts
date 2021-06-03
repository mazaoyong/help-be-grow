import React from 'react';
import { IGridColumn } from 'zent';
interface IEasyGridRadioProps {
    rowKey: any;
    row: any;
}
export declare const EasyGridRadio: React.FC<IEasyGridRadioProps>;
interface IGetRadioConfigParams {
    rowKey: string;
    isFixed: boolean;
}
export declare const getRadioConfig: (params: IGetRadioConfigParams) => IGridColumn<any>;
export {};
