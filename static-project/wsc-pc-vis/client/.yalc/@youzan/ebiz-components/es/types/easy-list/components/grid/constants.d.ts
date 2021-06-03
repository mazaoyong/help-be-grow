import { IEasyGridProps } from '../../types/grid';
interface IEasyGridAdaptorQueries {
    datasets: any[];
    pageNumber: number;
    pageSize: number;
    total: number;
    loading: boolean;
    sortBy: string | undefined;
    sortType: 'asc' | 'desc' | '';
    selectedRowKeys: string[];
}
interface IEasyGridAdaptorRes {
    queries: IEasyGridAdaptorQueries;
    setPage(p: number): void;
    setFilter(filter: Record<string, any>): void;
}
declare type EasyGridAdaptorType = (props: IEasyGridProps) => IEasyGridAdaptorRes;
export declare const adaptorConstructor: EasyGridAdaptorType;
export declare const CUSTOM_COLUMNS_KEY = "$$EASY_GRID_CUSTOM_COLUMNS";
export declare const CUSTOM_COLUMNS_DIALOG_ID = "easyGridCustomColumns";
export {};
