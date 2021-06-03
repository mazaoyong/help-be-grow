
import React, { ReactElement } from 'react';

export interface IDialogOptions {
  header: IHeaderOptions;
  table: ITableOptions;
  footer: IFooterOptions;
  ext: any;

  onSubmit: (selectedRows: any[], ext: any) => Promise<void>;
  onFetch: (data: { header: any, table: any, footer: any }, params?: any) => Promise<{ datasets: any[], totalItem: number, current: number, pageSize?: number }>,
  onSelect?: (data: any, ext: any, onExtChange: (value: any) => any) => void | Promise<any[]>;
  onClose?: () => void;
  afterFetch?: (context: IDialogProps) => Promise<void>;

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
  ext: any;
  loading: boolean;

  // provide ability to close dialog
  setExt: (ext: any, cb?: (() => void) | undefined) => void;
  fetch: (params?: any) => void;
  submit: () => void;
  cancel: () => void;
  change: (value: any) => Promise<any>;
  select: (selectedkeys: string, selectedRows: Array<any>, currentRow: number) => void;
}

export interface IHeaderOptions {
  component?: ReactElement<IDialogProps>;
  children?: IHeaderChild[];
}

export interface ITableOptions {
  // custom properties
  selectedRows?: any[],

  // original properties
  columns: ITableColumn[];
  rowKey: string;
  emptyLabel?: string;
  getRowConf?: (data: Object, index: number) => { canSelect: boolean, rowClass: string }
  batchComponents?: any[];
  selection?: {
    indeterminateRowKeys?: Array<string>;
    isSingleSelection?: boolean;
    needCrossPage?: boolean;
    onSelect?: (selectedkeys: string, selectedRows: Array<any>, currentRow: number) => void;
  }
}

export interface IFooterOptions {
  component: ReactElement<IDialogProps>;
}

interface ITableColumn {
  title: string
  name: string
  width?: number
  isMoney?: boolean
  needSort?: boolean
  bodyRender?: (data: any, callbacks: {
    ext: any;
    onRowSelect: () => void,
    onExtChange: (ext: any | ((prev: any) => any), cb?: (() => void) | undefined) => void,
  }) => React.ReactNode
  textAlign?: 'left' | 'right' | 'center'
}

export interface IHeaderChild {
  name: string;
  type: IHeaderChildType;
  key?: number;
  text?: string;
  data?: any[];
  textAlign?: 'left' | 'right';
  component?: ReactElement<IDialogProps>;
  [props: string]: any;
}

export type IHeaderChildType = 'Search'|'Button'|'Select'|'Checkbox'|'Custom';
