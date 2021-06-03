import { ICheckboxGroupProps, IInputCoreProps, IDatePickerProps, IRadioGroupProps, IDateRangeQuickPickerProps, ISelectProps, TabType } from 'zent';
import { ComponentType, ReactNode } from 'react';
declare type WatchCtxSetter = {
    visible?: boolean;
    disabled?: boolean;
    value?: any;
} & Record<string, any>;
export interface IFieldContextType {
    set(payload: WatchCtxSetter | null): void;
}
declare type IQueryDataType = Record<string, any>;
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
declare type DatePicker = 'DatePicker' | 'QuarterPicker' | 'MonthPicker' | 'WeekPicker' | 'DateRangePicker' | 'TimePicker' | 'TimeRangePicker';
export declare enum DatePickerTypes {
    DatePicker = "DatePicker",
    QuarterPicker = "QuarterPicker",
    MonthPicker = "MonthPicker",
    WeekPicker = "WeekPicker",
    DateRangePicker = "DateRangePicker",
    TimePicker = "TimePicker",
    TimeRangePicker = "DatePicker",
    DateRangeQuickPicker = "DateRangeQuickPicker"
}
export declare type ReservedType = 'Input' | 'Select' | 'Checkbox' | 'Radio' | DatePicker | 'DateRangeQuickPicker' | 'Custom';
export declare type WatchFunc = (value: any, currentFieldContext: IFieldContextType, values: Record<string, any>) => void;
export interface IFilterModelUnion {
    fieldValue: any;
    status: IStatusType;
    props: any;
}
export declare type ResponseData = Record<string, Omit<IFilterModelUnion, 'fieldValue'> & {
    value: any;
}>;
export interface IFilterBaseConf<Value> {
    name: string;
    label?: ReactNode;
    type: ReservedType;
    defaultValue?: Value;
    visible?: boolean;
    disabled?: boolean;
    onChange?(value: any): void;
    watch?: Record<string, WatchFunc> | Array<[WatchFunc, string[]]>;
}
export declare type ISpecificConfType<T, Value = any> = {
    inheritProps?: Omit<T, 'value' | 'defaultValue'> & Record<string, any>;
} & IFilterBaseConf<Value>;
export declare type ISpecificControlType<T, Value> = {
    value: Value;
    onChange(value: Value): void;
} & T;
export interface IInputConfType extends ISpecificConfType<Omit<IInputCoreProps, 'size' | 'type'>, string> {
    type: 'Input';
}
export declare type IInputControlType = ISpecificControlType<IInputCoreProps, string>;
export interface IRadioConfType extends ISpecificConfType<IRadioGroupProps<any>> {
    type: 'Radio';
    options: IOption<any>[];
}
export interface IRadioControlType extends ISpecificControlType<IRadioGroupProps<any>, any> {
    options: IOption<any>[];
}
export interface ICheckboxConfType extends ISpecificConfType<ICheckboxGroupProps<string[]>, string[]> {
    type: 'Checkbox';
    options: IOption[];
}
export interface ICheckboxControlType extends ISpecificControlType<ICheckboxGroupProps<string[]>, string[]> {
    options: IOption[];
}
export interface IDatePickerConfType extends ISpecificConfType<IDatePickerProps> {
    type: DatePicker;
}
export declare type ITimeType = number | string | Date | undefined;
export interface IModifiedPresetDays {
    text: string;
    value: any;
}
declare type IDateRangeQuickPickerType = Omit<IDateRangeQuickPickerProps, 'onChange' | 'format' | 'preset'> & {
    preset?: IModifiedPresetDays[];
};
export interface IDateRangeQuickPickerConfType extends ISpecificConfType<IDateRangeQuickPickerType> {
    type: 'DateRangeQuickPicker';
}
export declare type IDateRangeQuickPickerControlType = ISpecificControlType<IDateRangeQuickPickerType, any[]>;
declare type remoteOptions = () => Promise<IOption[]>;
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
export declare type ICombinedFilterConf = IInputConfType | ICheckboxConfType | IRadioConfType | IDatePickerConfType | IDateRangeQuickPickerConfType | ISelectConfType | ICustomConfType;
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
export declare type FilterRefType = IRenderPropsType;
export declare type IFilterActionsAdaptor = (props: Record<string, any>) => {
    afterSubmit?(query: IQueryDataType): void;
    afterReset?(query: IQueryDataType): void;
    initValuePath: string;
    queries(props: any): Record<string, any>;
    loading(props: any): boolean;
};
export declare type FilterConfigType = ICombinedFilterConf[] | Array<ICombinedFilterConf[] | ICombinedFilterConf>;
declare type RenderActionFC = (filter: FilterRefType) => ReactNode;
export declare type ActionCustomNodeType = ReactNode | RenderActionFC;
export interface IFilterProps {
    config: FilterConfigType;
    value?: Record<string, any>;
    formatQueries?(queries: IQueryDataType): IQueryDataType;
    formatFields?(fields: IQueryDataType, status: IPropsAndStatus['status']): IQueryDataType;
    onChange?(changeValue: {
        name: string;
        value: any;
    }[], queryData: IQueryDataType, changedStatus: Record<string, IStatusType>): void;
    onSubmit?(queryData: IQueryDataType, status: Record<string, IStatusType>): void;
    onReset?(): void;
    adaptor?: IFilterActionsAdaptor;
    autoFilter?: boolean;
    layout?: 'horizontal' | 'vertical';
    renderActions?: ComponentType<{
        filter: FilterRefType;
    }>;
    actionsOption?: {
        isLink?: boolean;
        beforeReset?: ActionCustomNodeType;
        afterReset?: ActionCustomNodeType;
    };
    backgroundColor?: string;
    /** 折叠显示的配置项 */
    defaultCollapseState?: 'expand' | 'collapse';
    collapseConfig?: FilterConfigType;
    collapseSwitcherLabel?: [string, string];
}
export interface ISearchProps {
    name: string;
    placeholder?: string;
    position?: 'left' | 'right';
    onChange?(keyword: string): void;
    afterPressEnter?(): void;
    children?: ReactNode | ComponentType<{
        onChange(key: string, value: any): void;
        values: Record<string, any>;
    }>;
}
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
export {};
