import React, { ReactElement } from 'react';
import { ITableCellPos } from '@zent/compat';
export interface IDialogOptions {
  header: IHeaderOptions;
  table: ITableOptions;
  footer: IFooterOptions;

  onSubmit: (selectedRows: any[]) => Promise<void>;
  onFetch: (data: {
    header: any;
    table: any;
    footer: any;
  }) => Promise<{ datasets: any[]; totalItem: number; current: number; pageSize?: number }>;
  onSelect?: (data: any) => void | Promise<any[]>;
  onClose?: () => void;

  // original params in DialogOptions, expect for children and footer
  title?: React.ReactNode;
  visible?: boolean;
  closeBtn?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  className?: string;
  prefix?: string;
  style?: React.CSSProperties;
}

export interface IDialogProps {
  header: any;
  table: any;
  footer: any;
  loading: boolean;

  // provide ability to close dialog
  fetch: () => void;
  submit: () => void;
  cancel: () => void;
  change: (value: any) => Promise<any>;
  select?: (selectedkeys: string, selectedRows: Array<any>, currentRow: number) => void;
}

export interface IHeaderOptions {
  component?: ReactElement<IDialogProps>;
  children?: IHeaderChild[];
}

export interface ITableOptions {
  // custom properties
  selectedRows?: any[];

  // original properties
  columns: ITableColumn[];
  rowKey: string;
  emptyLabel?: string;
  getRowConf?: (data: Object, index: number) => { canSelect: boolean; rowClass: string };
  batchComponents?: any[];
  selection?: {
    indeterminateRowKeys?: Array<string>;
    isSingleSelection?: boolean;
    needCrossPage?: boolean;
    onSelect?: (selectedkeys: string, selectedRows: Array<any>, currentRow: number) => void;
  };
}

export interface INormalizedTableColumn {
  title: string;
  name: string;
  width?: number;
  isMoney?: boolean;
  needSort?: boolean;
  bodyRender?: (data: any, pos?: ITableCellPos, name?: string) => React.ReactNode;
  textAlign?: 'left' | 'right' | 'center';
}

// @upgrade: zent8
export interface INormalizedTableOptions extends Omit<ITableOptions, 'columns'> {
  columns: INormalizedTableColumn[];
}

export interface IFooterOptions {
  component: ReactElement<IDialogProps>;
}

interface ITableColumn {
  title: string;
  name: string;
  width?: number;
  isMoney?: boolean;
  needSort?: boolean;
  bodyRender?: (data: any, callBack?: Function) => React.ReactNode;
  textAlign?: 'left' | 'right' | 'center';
}

export interface IHeaderChild {
  name: string;
  type: IHeaderChildType;
  key?: number;
  text?: string;
  data?: any[];
  childProps?: any;
  textAlign?: 'left' | 'right';
  component?: ReactElement<IDialogProps>;
}

export type IHeaderChildType = 'Search' | 'Button' | 'Select' | 'Checkbox' | 'Custom';
