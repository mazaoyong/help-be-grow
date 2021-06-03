import { Component } from 'react';
import { IORderTableProps, IPageRequest } from './types';
import { IFormatedCols } from './utils/columns-formate';
import { PaginationChangeHandler } from 'zent/es/pagination/impl/BasePagination';
interface IOrderTableState {
    renderConf: IFormatedCols;
    loading: boolean;
    selectNum: number;
    totalNumber: number;
    datasets: any[];
    selectedRows: number[];
    pageInfo: {
        total: number;
        current: number;
        pageSize: 20 | number;
    };
}
declare class OrderTable extends Component<IORderTableProps, IOrderTableState> {
    constructor(props: IORderTableProps);
    handlePageChange: PaginationChangeHandler;
    fetchingData: (zanQuery: any, pageRequest: IPageRequest) => void;
    handleSelect: (selected: number, row: number) => void;
    componentDidMount(): void;
    refreshData: (getFirstPage?: boolean) => void;
    render(): JSX.Element;
}
export default OrderTable;
