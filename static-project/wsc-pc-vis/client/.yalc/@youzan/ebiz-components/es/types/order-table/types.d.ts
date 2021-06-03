import { ReactNode, ComponentType, CSSProperties } from 'react';
export declare type Omit<T, K extends keyof T> = {
    [P in ({
        [P in keyof T]: P;
    } & {
        [P in K]: never;
    } & {
        [x: string]: never;
    })[keyof T]]: T[P];
};
declare type bodyRenderFunc = (row: object, index?: number) => ReactNode;
export declare type orderTableCols = Array<{
    title: Required<ReactNode>;
    name: Required<string>;
    width?: string;
    textAlign?: CSSProperties['textAlign'];
    bodyRender?: bodyRenderFunc;
    isHead?: true;
}>;
declare type fetchDataFunc = (filterConditions: object, pageConditions: IPageRequest) => Promise<any>;
export interface IPageRequest {
    pageNumber: number;
    pageSize?: number;
    sort?: IPageRequestSortType;
    total?: number;
}
interface IPageRequestSortType {
    orders: [{
        direction: string;
        nullHandling?: (() => void);
        property: string;
    }];
}
export interface IDataStruct {
    datasets: any[];
    total: number;
    current: number;
}
export interface IORderTableProps {
    columns: orderTableCols;
    fetchData: fetchDataFunc;
    rowKey?: string;
    emptyLabel?: () => ReactNode;
    selectable?: true;
    onSelect?: (selectedRows: object) => any;
    onDataChange?: (data: object) => any;
    extend?: (row: object, index?: number, datasets?: object[]) => ReactNode;
    zanQuery?: {
        [key: string]: any;
    };
    pageSize?: number;
    batchComponent?: ComponentType[];
}
export {};
