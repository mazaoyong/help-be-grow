import React from 'react';

type FilterFunc = (keyword: string, option: IOption) => boolean;
type Mode = 'async' | 'sync';
interface IEbizSelectBaseProps {
  mode?: Mode;
  value?: any | any[];
  multiple?: boolean;
  tags?: boolean;
  offset?: number;
  onOpen?(): void;
  onClose?(): void;
  disabled?: boolean;
  noData?: React.ReactNode;
  placeholder?: string;
  defaultValue?: any[];
  width?: number | string;
  maxSize?: number | string;
  prefixOption?: React.ReactNode;
  suffixOption?: React.ReactNode;
  defaultOptions?: IOption[];
  filter?: boolean | FilterFunc;
  onSelect?(value: any, items: IOption[] | undefined): void;
  onChange?(values: any[], selectedItems: IOption[] | undefined): void;
  // 2020-02
  clearable?: boolean;
  // 2020-03
  closeOnSelect?: boolean;
  // 2020-04
  noAnimate?: boolean;
  noKeyboardHandle?: boolean;
  // 2020-07
  className?: string;
  dropdownClassName?: string;
  // 2020-08
  // 在多选模式下展示的tag数量最多为{{ displayNum }}
  displayNum?: number;
  onKeywordChange?(keyword: string): any;
}

export interface IOption {
  // 展示的文本
  text: string;
  // 选中之后的value
  value: any;
  // 额外的展示内容，这个React.ReactNode会展示在选项列表中，但是选中之后
  // 输入框展示的值仍旧是text的内容，一般用于对当前选项内容添加说明
  extra?: React.ReactNode;
  // 当前选项是否可选
  disabled?: boolean;
  // 是否是分组
  isGroup?: boolean;
}
export interface IEbizSelectSyncProps extends IEbizSelectBaseProps {
  mode?: 'sync';
  options: IOption[];
}

export interface IPageRequest {
  // 当前的页码
  current: number;
  pageSize?: number;
  // 必须要返回，组件需要根据这个来判断是否拉完了全部的option
  total: number;
}
export type FetchOptionsRes = Promise<{
  options: IOption[];
  pageInfo: IPageRequest;
}>;

interface IDebounceConfig {
  leading?: boolean; // false
  trailing?: boolean; // true
  wait?: number; // default 200
}
export interface IEbizSelectAsyncProps extends IEbizSelectBaseProps {
  mode: 'async';
  onAdd?(): void;
  showAdd?: boolean;
  onRefresh?(): void;
  showRefresh?: boolean;
  fetchOnOpened?: boolean;
  fetchOnMounted?: boolean;
  debounceConf?: IDebounceConfig;
  fetchOptions(filterKeyword: string, pageRequest: IPageRequest): FetchOptionsRes;
}

export type IEbizSelectProps = IEbizSelectSyncProps | IEbizSelectAsyncProps;

interface IEbizSelectTriggerBaseProps {
  mode: Mode;
  width: string;
  tags: boolean;
  keyword: string | undefined;
  visible: boolean;
  clearable: boolean;
  disabled?: boolean;
  displayNum: number;
  placeholder?: string;
  value: any[] | undefined;
  filter: boolean | FilterFunc;
  handleFocus(visibility: true): void;
  selectedOpts: IEbizSelectSyncProps['options'] | undefined;
  handleDeleteOption(option?: IOption, reset?: boolean): void;
  handleKeywordChange(value: string): void;
}

export interface IEbizSelectAsyncTriggerProps extends IEbizSelectTriggerBaseProps {
  mode: 'async';
  debounceConf?: IDebounceConfig;
  fetchNow?(reset?: boolean, keyword?: string): void;
}

export interface IEbizSelectSyncTriggerProps extends IEbizSelectTriggerBaseProps {
  mode: 'sync';
}

export type IEbizSelectTriggerProps = IEbizSelectSyncTriggerProps | IEbizSelectAsyncTriggerProps;

export interface IEbizSelectDropDownProps {
  mode: Mode;
  width: string;
  tags: boolean;
  offset?: string;
  keyword: string | undefined;
  visible: boolean;
  loading: boolean;
  className?: string;
  noData?: React.ReactNode;
  onScrollBottom(): void;
  prefixOption?: React.ReactNode;
  suffixOption?: React.ReactNode;
  filter: boolean | FilterFunc;
  handleSelect(option: IOption): void;
  options: IEbizSelectSyncProps['options'] | undefined;
  selectedOpts: IEbizSelectSyncProps['options'] | undefined;
  noKeyboardHandle: boolean;
}

export interface IOptionProps extends IOption {
  tags: boolean;
  keyword?: string;
  isChecked?: boolean;
  isKeyboardChecked?: boolean;
  handleClick?(option: IOption): void;
}

export interface IUseRemoteOptionsSettings extends IEbizSelectBaseProps {
  /**
   * 是否在过滤的时候开启缓存，一般要根据fetchOnOpened属性来判断，
   * 如果开启了上述功能，就不需要缓存了
   */
  useFilterCache: boolean;
  fetchOptions(filterKeyword: string, pageRequest: IPageRequest): FetchOptionsRes;
}

export interface IUseRemoteOptionsRes {
  loading: boolean;
  fetchNow?(reset?: boolean, keyword?: string): void;
  remoteOptions: IOption[];
  setOptionCache(cleanPrevCache: boolean): void;
}

export interface IEbizTagListProps {
  disabled: boolean;
  options?: IOption[];
  displayNum: number;
  className?: string;
  handleClose(option: IOption): void;
}
