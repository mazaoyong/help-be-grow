import { ReactNode, Component } from 'react';
import { IFormProps, IValidators } from 'zent';
import { Omit } from 'utility-types';
import { ZentForm } from 'zent/es/form/ZentForm';
import { IFormFieldPropsBase } from 'zent/es/form/shared';
declare type IFormCreatorFn = (...args: any[]) => ReactNode;
declare type IValue = any[] | any;
export declare type IFormShowFn = (data?: IValue, form?: ZentForm<any>) => boolean | Promise<boolean>;
export interface IFormWatch {
    dep?: string | string[];
    fn?: (data?: IValue, form?: ZentForm<any>) => any;
    immediate?: boolean;
}
export interface IFormShow extends IFormWatch {
    fn?: IFormShowFn;
    value?: boolean;
}
export declare type IDependent = IFormWatch | IFormShow;
export declare type IGetPropsFn = (form?: ZentForm<any>) => any;
export interface IFormCreatorConfig extends IFormFieldPropsBase<any> {
    component?: Component | IFormCreatorFn | ReactNode;
    watch?: IFormWatch[];
    show?: IFormShow;
    name?: string | string[];
    keyName?: string;
    children?: IFormCreatorConfig[];
    props?: IGetPropsFn;
    fieldProps?: IGetPropsFn;
    type?: string | 'field';
    defaultValue?: any;
    validators?: IValidators<any>;
    /** 在组件unmount的时候移除model，在这个版本的EasyForm中默认为true */
    destroyOnUnmount?: boolean;
    checkShowState?: boolean;
}
export interface IFormRenderProps extends Omit<IFormProps<any, any>, 'form'> {
    config: IFormCreatorConfig[];
    preview?: boolean;
    initialize?: () => Promise<any>;
    ref?: (form: ZentForm<any>) => void;
    checkShowState?: boolean;
}
export interface IFormItemProps {
    config: IFormCreatorConfig;
    form: ZentForm<any>;
    initialState?: boolean;
    checkShowState?: boolean;
}
export interface IFormPreviewProps {
    form: ZentForm<any>;
}
export interface IFormFieldProps<T> {
    value: T;
    onChange: (data: T) => void;
}
export interface IMoneyRangeRule {
    max: number;
    min: number;
    message?: string;
    isCent?: boolean;
}
export interface IIntRangeRule {
    max: number;
    min: number;
    message?: string;
}
export {};
