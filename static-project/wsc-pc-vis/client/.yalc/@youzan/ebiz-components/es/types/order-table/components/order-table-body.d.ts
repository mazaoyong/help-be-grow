import React, { Component, ReactNode } from 'react';
import { orderTableCols } from '../types';
declare type objectLike = {
    [key: string]: any;
};
interface IOrderTableBodyProps {
    selectable?: boolean;
    headKeys: string[];
    bodyKeys: string[];
    columns: orderTableCols;
    datasets: object[];
    selectAll: {
        [key: string]: boolean;
    };
    extend?: (row: object, index?: number, datasets?: object[]) => ReactNode;
    onSelectChange: (selected: number, row: number) => void;
}
interface IOrderTableBodyState {
    headerRenderConf: any[];
    bodyRenderConf: any[];
    selectRows: number[];
}
export default class OrderTableBody extends Component<IOrderTableBodyProps, IOrderTableBodyState> {
    constructor(props: IOrderTableBodyProps);
    renderHeadBox: (data: objectLike, index: number, colSpan: number) => JSX.Element;
    renderContentBox: (data: objectLike, index: number, renderConf: any[]) => React.ReactNode;
    static getDerivedStateFromProps(nextProps: IOrderTableBodyProps, state: IOrderTableBodyState): IOrderTableBodyState | null;
    render(): JSX.Element;
}
export {};
