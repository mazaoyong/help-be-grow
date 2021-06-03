import {
  IGridProps,
  IGridSelection,
  IGridPageInfo,
  IGridColumn,
  PopPositions,
  IconType,
  ITagProps,
  IPopProps,
  Sweetalert,
  IPopoverContext,
  IInputProps,
} from 'zent';
import React from 'react';
import { IListContext } from './list';
import { ISyncValidator } from 'formulr';

export type EasyGridSelectType = 'single' | 'multiple';
export interface IEasyGridSelection<Data = any> {
  /** 如何渲染选择 */
  selectType?: EasyGridSelectType;
  selectedRowKeys?: string[];
  onSelect?: (selectedkeys: any[], selectedRows: Data[], changeRow: Data | Data[]) => boolean;
  getCheckboxProps?: IGridSelection['getCheckboxProps'];
}

export interface IEasyGridColumn<Data = any> extends IGridColumn<Data> {
  /** **注意，你能够使用属性运算符（即 `.` 运算）然后配合 `formatter` 属性对数据进行格式化** */
  name?: string;
  headerHelp?: React.ReactNode;
  helpPopPosition?: PopPositions;
  visible?: boolean;
  /** 如果title需要渲染成ReactNode，但是有需要参与自定义表头，可以设置这个值 */
  altTitle?: string;
  forbidCustom?: boolean;
  formatter?(data: any): any;
}

export interface IEasyGridProps
  extends Omit<IGridProps, 'columns' | 'datasets' | 'selection' | 'pageInfo'> {
  datasets?: Record<string, any>[];
  columns: IEasyGridColumn[];
  easySelection?: boolean;

  selection?: boolean | EasyGridSelectType | IEasyGridSelection;
  // flatted pageInfo property
  pageSize?: number;
  pageNumber?: number;
  total?: number;
  pageSizeOptions?: IGridPageInfo['pageSizeOptions'];
  pageable?: boolean;
  /** 是否在空列表的时候展示创建文案 */
  emptyCreateLabel?: React.ReactNode;
  /** 是否允许自定义表头 */
  customColumns?: boolean;
  /** 缓存的表头配置的key，一般在SPA的页面中需要使用，不指定则按照URL最后一个path作为缓存key */
  customColumnsCacheKey?: string;
  customColumnsTriggerText?: string;
  /** 自定义表头弹窗的标题 */
  customColumnsDialogTitle?: string;
}

export interface IHeaderHelpProps {
  title: React.ReactNode;
  headerHelp: React.ReactNode;
  className?: string;
  position?: PopPositions;
  iconType?: IconType;
}

export interface IGoodsBriefCardProps {
  title: string;
  price?: string | number;
  label?: string;
  labelTagTheme?: ITagProps['theme'];
  labelOutline?: ITagProps['outline'];
  labelProps?: ITagProps;
  image?: string;
  imageSize?: number;
  image2x?: string;
  url?: string;
  className?: string;
}

export type IBodyRenderFunc = (
  data: any,
  pos: { row: number; column: number; fixed?: 'left' | 'right' },
  name: string
) => React.ReactNode;

export interface IQuickEditConfig {
  // 快捷编辑的数据类型，有两种，分别是数字、文本
  type: 'number' | 'text';
  // 快捷编辑的触发图标
  icon?: IconType;
  defaultValue?: (data: any, name: string) => any | string | number;
  confirmText?: string;
  cancelText?: string;
  // 摁回车键提交
  pressEnter?: boolean;
  // 格式化
  formatter?(value: string): any;
  // 确定回调
  onConfirm?(value: any, rowData: any): void | Promise<boolean>;
  // 关闭回调
  onCancel?(): void;
  placeholder?: string;
  inputProps?: IInputProps;
  required?: boolean | string;
  // validators
  validators?: ISyncValidator<any>[];
}

interface IGridPopChildrenProps {
  pop: IPopoverContext;
  data?: any;
  list: IListContext;
}

type IGridPopChildren = (ctx: IGridPopChildrenProps) => React.ReactNode;

export interface IGridPop {
  text: React.ReactNode;
  trigger: IPopProps['trigger'];
  centerArrow?: IPopProps['centerArrow'];
  cushion?: IPopProps['cushion'];
  position?: IPopProps['position'];
  type?: IPopProps['type'];
  className?: IPopProps['className'];
  content?: IPopProps['content'];
  confirmText?: IPopProps['confirmText'];
  cancelText?: IPopProps['cancelText'];
  onConfirm?: IPopProps['onConfirm'];
  onCancel?: IPopProps['onCancel'];
  data?: any;
  disabled?: boolean;
  children?: IGridPopChildren;
  /** 是否阻止默认行为 */
  preventDefault?: boolean;
  /** 是否在展示时调整位置 */
  adjustPositionOnShow?: boolean;
}

interface IGridSweetAlertChildrenProps {
  data?: any;
  list: IListContext;
}

type IGridSweetAlertChildren = (ctx: IGridSweetAlertChildrenProps) => React.ReactNode;

export interface IGridSweetAlert extends Sweetalert.IConfirmOption {
  sweetType?: 'alert' | 'confirm';
  text: string;
  data?: any;
  children?: IGridSweetAlertChildren;
}

export interface IEasyGridRef {
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<string[]>>;
}
