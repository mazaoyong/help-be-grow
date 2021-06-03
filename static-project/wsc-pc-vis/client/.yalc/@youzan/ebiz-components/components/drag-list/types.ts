import React from 'react';
import { IIconProps } from '../icon/types';

export interface IDragColumn<DataType> {
  title: React.ReactNode; // 展示的标题
  width?: number;
  name?: string;
  bodyRender?(rowData: DataType): React.ReactNode | React.ComponentType<any>;
  helpDesc?: React.ReactNode; // 提示文案
  textAlign?: React.CSSProperties['textAlign']; // 文字对齐方式
  defaultText?: React.ReactNode;
}

export interface IDragListProps<DataType = any> {
  rowKey: string; // 每一行的唯一标识
  className?: string;
  icon?: IIconProps['type']; // icon 名字
  iconSize?: string;
  iconColor?: string; // icon 颜色
  columns: IDragColumn<DataType>[];
  noData?: React.ReactNode;
  filter?(rowData: DataType): boolean; // 过滤选项
  onOrderChange?(curDatasets: DataType[], prevDatasets: DataType[]): void;
  fetchDatasets(): Promise<Record<string, any>[]>;
  disabledAnchor?: React.ReactNode; // 禁用拖拽时候的锚点展示
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
  icon: IIconProps['type']; // icon 名字
  iconSize: string;
  iconColor: string; // icon 颜色
  datasets: Record<string, any>;
  columns: IDragColumn<any>[];
  noAnchor?: boolean;
  disabledAnchor?: React.ReactNode;
}
