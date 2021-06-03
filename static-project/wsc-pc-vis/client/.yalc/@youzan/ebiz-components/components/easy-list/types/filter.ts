import {
  ICheckboxGroupProps,
  IInputCoreProps,
  IDatePickerProps,
  IRadioGroupProps,
  IDateRangeQuickPickerProps,
  ISelectProps,
  TabType,
} from 'zent';
import { ComponentType, ReactNode } from 'react';

type WatchCtxSetter = { visible?: boolean; disabled?: boolean; value?: any } & Record<string, any>;
// 在监听副作用函数中的上问下对象中应该具备的东西
export interface IFieldContextType {
  set(payload: WatchCtxSetter | null): void;
}

type IQueryDataType = Record<string, any>;

export interface IStatusType extends Record<string, any> {
  disabled: boolean;
  visible: boolean;
}

export interface IOption<Value = string> {
  text: string;
  value: Value;
  disabled?: true;
  [key: string]: any;
}

type DatePicker =
  | 'DatePicker'
  | 'QuarterPicker'
  | 'MonthPicker'
  | 'WeekPicker'
  | 'DateRangePicker'
  | 'TimePicker'
  | 'TimeRangePicker';
export enum DatePickerTypes {
  DatePicker = 'DatePicker',
  QuarterPicker = 'QuarterPicker',
  MonthPicker = 'MonthPicker',
  WeekPicker = 'WeekPicker',
  DateRangePicker = 'DateRangePicker',
  TimePicker = 'TimePicker',
  TimeRangePicker = 'DatePicker',
  DateRangeQuickPicker = 'DateRangeQuickPicker',
}
export type ReservedType =
  | 'Input'
  | 'Select'
  | 'Checkbox'
  | 'Radio'
  | DatePicker
  | 'DateRangeQuickPicker'
  | 'Custom';
export type WatchFunc = (
  value: any,
  currentFieldContext: IFieldContextType,
  values: Record<string, any>
) => void;
export interface IFilterModelUnion {
  fieldValue: any;
  status: IStatusType;
  props: any;
}
export type ResponseData = Record<string, Omit<IFilterModelUnion, 'fieldValue'> & { value: any }>;

// base filter config types
export interface IFilterBaseConf<Value> {
  name: string; // required
  label?: ReactNode;
  type: ReservedType; // required
  defaultValue?: Value;
  visible?: boolean; // default true
  disabled?: boolean; // default false
  onChange?(value: any): void;
  // 观察某个字段的值，然后修改自身的状态
  watch?: Record<string, WatchFunc> | Array<[WatchFunc, string[]]>;
}

// 将不同的type融合上inheritProps属性，用于conf的属性推断
export type ISpecificConfType<T, Value = any> = {
  inheritProps?: Omit<T, 'value' | 'defaultValue'> & Record<string, any>;
} & IFilterBaseConf<Value>;
// 通过继承类型获取不同组件的Control的类型
export type ISpecificControlType<T, Value> = {
  value: Value;
  onChange(value: Value): void;
} & T;

// Input
// 需要移除size和type两个属性
export interface IInputConfType
  extends ISpecificConfType<Omit<IInputCoreProps, 'size' | 'type'>, string> {
  type: 'Input';
}
export type IInputControlType = ISpecificControlType<IInputCoreProps, string>;

// Radio
export interface IRadioConfType extends ISpecificConfType<IRadioGroupProps<any>> {
  type: 'Radio';
  options: IOption<any>[];
}
export interface IRadioControlType extends ISpecificControlType<IRadioGroupProps<any>, any> {
  options: IOption<any>[];
}

// Checkbox
export interface ICheckboxConfType
  extends ISpecificConfType<ICheckboxGroupProps<string[]>, string[]> {
  type: 'Checkbox';
  options: IOption[];
}
export interface ICheckboxControlType
  extends ISpecificControlType<ICheckboxGroupProps<string[]>, string[]> {
  options: IOption[];
}

// DateType
export interface IDatePickerConfType extends ISpecificConfType<IDatePickerProps> {
  type: DatePicker;
}

// DateQuickRangePicker
export type ITimeType = number | string | Date | undefined;
export interface IModifiedPresetDays {
  text: string;
  value: any;
}
type IDateRangeQuickPickerType = Omit<
  IDateRangeQuickPickerProps,
  'onChange' | 'format' | 'preset'
> & { preset?: IModifiedPresetDays[] };
export interface IDateRangeQuickPickerConfType
  extends ISpecificConfType<IDateRangeQuickPickerType> {
  type: 'DateRangeQuickPicker';
}
export type IDateRangeQuickPickerControlType = ISpecificControlType<
  IDateRangeQuickPickerType,
  any[]
>;

// Select
type remoteOptions = () => Promise<IOption[]>;
export interface ISelectConfType extends ISpecificConfType<Omit<ISelectProps, 'data'>> {
  type: 'Select';
  options: IOption<string>[] | remoteOptions;
}
export interface ISelectControlType extends ISpecificControlType<ISelectProps, string | string[]> {
  options: IOption<string>[] | remoteOptions;
}

export interface ICustomConfType extends ISpecificConfType<any> {
  type: 'Custom';
  renderField: ComponentType<any>;
}

export interface INeedOptionsConfType extends ISpecificConfType<ISelectProps> {
  type: any;
  options: IOption<string>[];
}

export type ICombinedFilterConf =
  | IInputConfType
  | ICheckboxConfType
  | IRadioConfType
  | IDatePickerConfType
  | IDateRangeQuickPickerConfType
  | ISelectConfType
  | ICustomConfType;

export interface IPropsAndStatus {
  props: Record<string, Record<string, any>>;
  status: Record<string, IStatusType>;
}

export interface ICollapseButtonRef {
  toggleState(state: 'expand' | 'collapse'): void;
}
export interface IRenderPropsType extends ICollapseButtonRef {
  submit(): void;
  reset(): void;
  getQueries(): Record<string, any>;
  getCurrentValues(): Record<string, any>;
  getLoading(): boolean;
}
export type FilterRefType = IRenderPropsType;

export type IFilterActionsAdaptor = (
  props: Record<string, any>
) => {
  afterSubmit?(query: IQueryDataType): void;
  afterReset?(query: IQueryDataType): void;
  initValuePath: string;
  queries(props: any): Record<string, any>;
  loading(props: any): boolean;
};

export type FilterConfigType =
  | ICombinedFilterConf[]
  | Array<ICombinedFilterConf[] | ICombinedFilterConf>;
type RenderActionFC = (filter: FilterRefType) => ReactNode;
export type ActionCustomNodeType = ReactNode | RenderActionFC;
// Filter的配置
export interface IFilterProps {
  config: FilterConfigType;
  // fields的值，只会在第一次初始化中使用，优先级要低于config中的defaultValue
  value?: Record<string, any>;
  formatQueries?(queries: IQueryDataType): IQueryDataType;
  formatFields?(fields: IQueryDataType, status: IPropsAndStatus['status']): IQueryDataType;
  onChange?(
    changeValue: { name: string; value: any }[],
    queryData: IQueryDataType,
    changedStatus: Record<string, IStatusType>
  ): void;
  onSubmit?(queryData: IQueryDataType, status: Record<string, IStatusType>): void;
  onReset?(): void;
  // 不需要用到这个，这个是用来确定规定数据使用方式的
  adaptor?: IFilterActionsAdaptor;
  autoFilter?: boolean;
  layout?: 'horizontal' | 'vertical';
  renderActions?: ComponentType<{ filter: FilterRefType }>;
  actionsOption?: {
    isLink?: boolean;
    beforeReset?: ActionCustomNodeType;
    afterReset?: ActionCustomNodeType;
  };
  // 2020-04
  backgroundColor?: string;
  // 2020-11
  /** 折叠显示的配置项 */
  defaultCollapseState?: 'expand' | 'collapse';
  collapseConfig?: FilterConfigType;
  collapseSwitcherLabel?: [string, string];
}

// Search 配置
export interface ISearchProps {
  name: string;
  placeholder?: string;
  position?: 'left' | 'right';
  onChange?(keyword: string): void;
  afterPressEnter?(): void;
  children?:
    | ReactNode
    | ComponentType<{
        onChange(key: string, value: any): void;
        values: Record<string, any>;
      }>;
}

// Tabs
export interface ITabsProps {
  name: string;
  tabs: ITabsConfig[];
  type?: TabType;
  defaultValue?: any;
  onChange?(value: any): void;
  onSubmit?(values: Record<string, any>): void;
  formatFields?(values: Record<string, any>): Record<string, any>;
}

export interface ITabsConfig {
  label: string;
  value: any;
  disabled?: boolean;
}
