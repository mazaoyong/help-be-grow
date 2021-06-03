import { Component, FunctionComponent, ReactElement } from 'react';

// 弹窗编辑类型：字符，数字，自定义<价格（单SKU，多SKU）等等>
export enum ListPopupEditorType {
  STR = 'STR',
  NUM = 'NUM',
  CUSTOM = 'CUSTOM'
}

export interface IListPopupEditorProps {
  type: ListPopupEditorType;
  children: ReactElement;
  width?: string | number;
  initialValue: any;
  validate: (value: any) => string;
  onSubmit: <T>(data: T) => void | Promise<T>;
  popupEl?:ReactElement;
  samName?: string,
}

export interface IListPopupEditorContentProps {
  pop: { open: () => void, close: () => void };
  value: any;
  width?: number | string;
  validate: (value: any) => string;
  onChange: (data: any) => void;
  onSubmit: (callback: () => void) => () => void;
  onCancel: (callback: () => void) => () => void;
}

export type IListPopupEditorContent = FunctionComponent<IListPopupEditorContentProps> | Component<IListPopupEditorContentProps>;
