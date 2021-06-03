import React from 'react';
import { IEasyGridProps } from '../../../types/grid';
declare type ColumnsType = IEasyGridProps['columns'];
interface IUseCustomColumnsRes {
    displayColumns: ColumnsType;
    CustomColumnsTrigger: React.ReactPortal | null;
}
export declare const useCustomColumns: (params: {
    columns: import("../../../types/grid").IEasyGridColumn<any>[];
    customColumns: boolean;
    customColumnsCacheKey: string | undefined;
    customColumnsTriggerText: string | undefined;
    customColumnsDialogTitle: string | undefined;
    ref: HTMLDivElement | null;
}) => IUseCustomColumnsRes;
export {};
