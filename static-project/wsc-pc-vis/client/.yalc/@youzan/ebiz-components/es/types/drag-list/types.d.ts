import React from 'react';
import { IIconProps } from '../icon/types';
export interface IDragColumn<DataType> {
    title: React.ReactNode;
    width?: number;
    name?: string;
    bodyRender?(rowData: DataType): React.ReactNode | React.ComponentType<any>;
    helpDesc?: React.ReactNode;
    textAlign?: React.CSSProperties['textAlign'];
    defaultText?: React.ReactNode;
}
export interface IDragListProps<DataType = any> {
    rowKey: string;
    className?: string;
    icon?: IIconProps['type'];
    iconSize?: string;
    iconColor?: string;
    columns: IDragColumn<DataType>[];
    noData?: React.ReactNode;
    filter?(rowData: DataType): boolean;
    onOrderChange?(curDatasets: DataType[], prevDatasets: DataType[]): void;
    fetchDatasets(): Promise<Record<string, any>[]>;
    disabledAnchor?: React.ReactNode;
    updateSignal?: number;
    swap?: boolean;
    swapClass?: string;
    ghostClass?: string;
    dragClass?: string;
    chosenClass?: string;
}
export interface IDragListBoxProps {
    className: string;
    columns: IDragColumn<any>[];
    children?: React.ReactNode;
}
export interface IDragItemProps {
    orderId: number;
    icon: IIconProps['type'];
    iconSize: string;
    iconColor: string;
    datasets: Record<string, any>;
    columns: IDragColumn<any>[];
    noAnchor?: boolean;
    disabledAnchor?: React.ReactNode;
}
