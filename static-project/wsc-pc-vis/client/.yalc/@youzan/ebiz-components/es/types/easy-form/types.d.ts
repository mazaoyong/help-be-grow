import { BasicModel, FieldArrayModel } from 'formulr';
import React from 'react';
import { ICheckboxGroupProps, IColorPickerProps, IDatePickerProps, IDateRangeQuickPickerProps, IFormProps, IInputCoreProps, INumberInputProps, IRadioGroupProps, ISelectProps, ISwitchProps, FieldModel, FieldSetModel, ValidateOccasion } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
/** 为了防止一些不必要的属性被暴露，这里就只暴露特殊的几个 */
declare type SlimFormProps = Pick<IFormProps<any, any>, 'disableEnterSubmit' | 'onReset' | 'scrollToError' | 'disabled' | 'onSubmitFail' | 'onSubmitSuccess'>;
export interface IEasyFormProps extends SlimFormProps {
    config: EasyFormConfigType[];
    /** 开启form预览窗口，**default: false** */
    preview?: boolean;
    /** 布局，**default: vertical** */
    layout?: 'horizontal' | 'vertical';
    /** 是否滚动到错误的地方 **default: false** */
    willScrollToError?: boolean;
    /**
     * 是否将model和视图完全分离？如果指定了这个属性，form不会根据config渲染field，
     * 取而代之的是，能够通过使用`FieldPlaceholder`组件来指定每个field的位置
     *
     * **default: false**
     */
    splitVM?: boolean;
    /**
     * 在引入其他地方引入的form config的时候，可能需要对field的配置进行重写，
     * 可以通过指定这个对象，对引入的form config特定配置进行重写。
     *
     * *但是这个重写的属性，不包括name和type属性（当然也包括custom模式下的
     * renderField属性）*
     */
    overrideConfigs?: Record<string, any>;
    /**
     * 是否添加冒号 **default: true**
     */
    addColon?: boolean;
    onChange?(formValues: Record<string, any>): void;
    /**
     * 比起zentForm，多封装了一个handleSubmit方法，用于触发表单提交
     * 在`zent7`中，通过调用这个方法修复`scrollToError`失效的问题
     */
    renderSubmit?: ((cb: (...args: any[]) => void, easyForm: IEasyFormInstance) => React.ReactNode) | boolean;
    onSubmit(easyForm: IEasyFormInstance): void;
    /** 当表单校验出错之后，会触发该方法 */
    onError?(err: any): void;
    children?: React.ReactNode;
}
export interface IFieldStatus {
    disabled: boolean;
    visible: boolean;
}
interface IFieldCtxSetter {
    props?: Record<string, any>;
    status?: Partial<IFieldStatus>;
    value?: any;
}
export interface IEasyFormWatchCtx<P = any> {
    /**
     * 设置属性函数，能够设置`visible`、`disabled`等几个预设属性来控制
     * fields的表现，设置`value`来变更当前的`value`（请注意设置过程中避
     * 免循环引用的情况导致form死循环），其他跟上述属性无关的属性都将
     * 作为props传入组件
     */
    set(payload: P extends any[] ? IFieldCtxSetter[] : IFieldCtxSetter): void;
}
declare type OriginalFormType = ZentForm<Record<string, EasyFormModelType>>;
export interface IEasyFormInstance {
    /** 原始的zent form对象 */
    zentForm: OriginalFormType;
    easyForm: {
        /** 该patchValue能够触发config中定义的watch方法，可以用过`invokeWatch=false`阻止这个行为 */
        patchValue(values: any, invokeWatch?: boolean): void;
    };
}
export declare type EasyFormRefType = IEasyFormInstance;
export declare type EasyFormWatchFunction<Value = any> = (value: Value, ctx: IEasyFormWatchCtx, easyForm: OriginalFormType) => void;
declare type DatePickerType = 'DatePicker' | 'QuarterPicker' | 'MonthPicker' | 'WeekPicker' | 'DateRangePicker' | 'TimePicker' | 'TimeRangePicker';
export declare type FormFieldsType = 'Input' | 'NumberInput' | 'Select' | 'Checkbox' | 'Radio' | 'Switch' | 'ColorPicker' | DatePickerType | 'DateRangeQuickPicker' | 'Custom' | 'Plain'
/** 特殊的内置类型 */
 | '__internal_group__' | '__internal_list__';
interface IPartialFieldProps {
    className?: string;
    style?: React.CSSProperties;
    withoutLabel?: boolean;
}
export declare type EasyFormWatchType = Record<string, EasyFormWatchFunction<any>>;
export declare type EasyFormConfigLabel = ((name: string, index: number) => string) | string;
interface IEasyFormBaseConfig {
    name: string;
    label?: EasyFormConfigLabel;
    type: FormFieldsType;
    visible?: boolean;
    onChange?(input: any): void;
    /**
     * field组件属性
     */
    disabled?: boolean;
    required?: boolean;
    defaultValue?: any;
    validators?: FieldModel<any>['validators'];
    /** 配置校验时机 */
    validateOccasion?: ValidateOccasion;
    /**
     * field属性，这个属性将不会覆盖配置中声明的属性，如required
     */
    fieldProps?: IPartialFieldProps & Record<string, any>;
    /** 传递给组件的属性 */
    inheritProps?: Record<string, any>;
    /**
     * 在field前面插入内容，如：
     * `label: {{prefix}} [placeholder   ] {{suffix}}`
     *
     * 可以用构造形如`[placeholder  ] 至 [placeholder  ]`这样的范围输入框
     */
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    /**
     * 在field底部显示的提示文字，如
     * ```
     * label: [placeholder   ]
     *        查看ebiz-component文档，请访问<a>这里</a>
     * ```
     */
    helpDesc?: React.ReactNode;
    /**
     * 监听字段的变化去改变自身，有两种用法：
     * 1. [**TODO**]~~一种是类似hooks的调用方式：为一个接收两个参数的函数~~
     * 2. 另一种是直接对某个field的值进行订阅：定义为一个对象，对象的键名则是监听的目标
     */
    watch?: EasyFormWatchType;
}
interface INoValueProps<Interface, ValueType = any> {
    defaultValue?: ValueType;
    inheritProps?: Omit<Interface, 'value' | 'defaultValue' | 'disabled' | 'onChange' | 'onBlur'>;
}
interface IEasyFormInputConfig extends INoValueProps<Partial<IInputCoreProps>, string> {
    type: 'Input';
}
interface IEasyFormNumberInputConfig extends INoValueProps<Partial<INumberInputProps>> {
    type: 'NumberInput';
}
interface IOption {
    text: string;
    value: string;
    [key: string]: any;
}
interface IEasyFormSelectConfig extends INoValueProps<Omit<ISelectProps, 'data'>, string> {
    type: 'Select';
    options: IOption[];
}
interface IEasyFormCheckboxConfig extends INoValueProps<ICheckboxGroupProps<string>, string[]> {
    type: 'Checkbox';
    options: IOption[];
}
interface IEasyFormRadioConfig extends INoValueProps<IRadioGroupProps<any>> {
    type: 'Radio';
    options: IOption[];
}
/**
 * 需要options属性的类型
 */
export declare type EasyFormOptionsRequiredTypes = (IEasyFormSelectConfig | IEasyFormCheckboxConfig | IEasyFormRadioConfig) & IEasyFormBaseConfig;
interface IEasyFormSwitchConfig extends INoValueProps<Omit<ISwitchProps, 'checked'>, string> {
    type: 'Switch';
}
/**
 * ColorPicker与zent不同，通过displayType来分发不同的ColorPicker组件
 */
export interface IEasyFormExtendsColorPickerProps {
    displayType?: 'board' | 'simple';
}
interface IEasyFormColorPickerConfig extends INoValueProps<IColorPickerProps & IEasyFormExtendsColorPickerProps> {
    type: 'ColorPicker';
}
interface IEasyFormDatePickerConfig extends INoValueProps<IDatePickerProps, [string, string]> {
    type: DatePickerType;
}
interface IModifiedPresetDays {
    text: string;
    value: any;
}
interface IEasyFormDateRangePickerConfig extends INoValueProps<Omit<IDateRangeQuickPickerProps, 'onChange' | 'format' | 'preset'>, [[string, string], any]> {
    type: 'DateRangeQuickPicker';
    preset?: IModifiedPresetDays[];
}
interface IEasyFormCustomConfig {
    type: 'Custom';
    renderField: React.ReactNode;
}
interface IForbidden_InternalGroupConfig extends IGroupEasyFormConfigs {
    /**
     * 请不要直接指定这个类型，如果要将config进行分组，
     * 请使用`EasyForm.group`方法将需要的config进行
     * 分组
     * ```
     * const { group } = EasyForm
     * return group({
     *  groupName: 'group1',
     *  config: [
     *    ...fieldConfig
     *  ]
     * })
     * ```
     */
    type: '__internal_group__';
    label?: string;
}
interface IForbidden_InternalListConfig extends IListEasyFormConfigs {
    /**
     * 请不要直接指定这个类型，如果要将config进行分组，
     * 请使用`EasyForm.list`方法将需要的config进行
     * 分组
     * ```
     * const { list } = EasyForm
     * return list({
     *  groupName: 'group1',
     *  repeatConfig: fieldConfig
     * })
     * ```
     */
    type: '__internal_list__';
}
declare type EasyFormPlainType = {
    type: 'Plain';
    node: React.ReactNode;
} & IEasyFormBaseConfig;
export declare type EasyFormInternalListType = IForbidden_InternalListConfig & IEasyFormBaseConfig;
export declare type EasyFormInternalGroupType = IForbidden_InternalGroupConfig & IEasyFormBaseConfig;
export declare type EasyFormConfigValidType = (IEasyFormInputConfig | IEasyFormNumberInputConfig | IEasyFormSelectConfig | IEasyFormCheckboxConfig | IEasyFormRadioConfig | IEasyFormCustomConfig | IEasyFormSwitchConfig | IEasyFormColorPickerConfig | IEasyFormDatePickerConfig | IEasyFormDateRangePickerConfig) & IEasyFormBaseConfig;
export declare type EasyFormConfigType = EasyFormPlainType | EasyFormConfigValidType | EasyFormInternalGroupType | EasyFormInternalListType;
export interface IGroupEasyFormConfigs {
    groupName: string;
    groupTitle: string | React.ReactNode;
    /**
     * 是否折叠分组
     */
    collapse?: boolean;
    config: EasyFormConfigType[];
    onChange?(value: Record<string, any>): void;
    /** 是否整块区域不可用，如果这个值被修改为false，则disabled属性会传到各个field上 */
    disabled?: boolean;
    watch?: EasyFormWatchType;
    hideGroupHeader?: boolean;
}
export interface IEasyFormListRepeatMethods {
    /** 添加一项，并将repeatConfig.defaultValue设置为初始值 */
    add(): void;
    /** 添加n个项，如果填写了`defaultValue`，就会将这个入参作为初始值来初始化 */
    add(addCount?: number, defaultValue?: any): void;
    /** 删除一项 */
    delete(): void;
    /** 删除n项，如果填写了`startIndex`，就会从`startIndex`开始删除n项 */
    delete(deleteCount?: number, startIndex?: number): void;
}
export interface IEasyFormRepeatTriggerProps {
    methods: IEasyFormListRepeatMethods;
    required: boolean;
    visible: boolean;
    disabled: boolean;
    label: string | null;
}
export interface IListEasyFormConfigs {
    listName: string;
    label?: string;
    fieldProps?: IPartialFieldProps & Record<string, any>;
    /**
     * 渲染触发数组变化的节点，该方法会带有几个实用方法，用于
     * 控制`repeatConfig`渲染的数量：
     * 1. `add`     添加一个或n个`repeatConfig`
     * 2. `delete`  删除最后一个或者删除第n个`repeatConfig`
     * 3. `filter`  过滤`repeatConfig`
     *
     * **请注意，一定要在返回的组件中，预留children的位置以供
     * 渲染list的内容**
     */
    repeatTrigger: React.ComponentType<IEasyFormRepeatTriggerProps>;
    /**
     * 需要重复的field配置，**注意：在`list`中，因为所有数据列
     * 表都是通过这个属性来渲染的，所以不允许使用`watch`方法来监
     * 听其他数据。**
     */
    repeatConfig: EasyFormConfigType;
    /**
     * 在重复生成`repeatConfig`的时候，需要指定唯一id
     * 如果没有声明这个方法，会采用`name + index`的方式
     * 命名每一个key
     */
    getRepeatKey?(name: string, idx: number): any;
    onChange?(value: any[]): void;
    /** 如果这个值为false，则表示包括，trigger在内都不会显示 */
    visible?: boolean;
    /** 这个参数将会影响repeatTrigger的disabled参数 */
    disabled?: boolean;
    watch?: EasyFormWatchType;
}
interface IFieldBaseConfigHandlerProps<ValueType> {
    defaultValue?: ValueType;
    onChange?(value: ValueType): void;
    onBlur?(value: ValueType): void;
}
export declare type FieldInjectPropsType<ValueType> = IEasyFormBaseConfig & Required<IFieldBaseConfigHandlerProps<ValueType>>;
export interface IEasyFormFieldRenderProps<Model, StatusModel, Config = EasyFormConfigType> {
    model: Model;
    statusModel: StatusModel;
    config: Config;
    addColon: boolean;
    disabled?: boolean;
    onChange(key: string, value: any): void;
}
interface IEasyFormFiledBaseProps {
    value: any;
    onChange(input: any): void;
}
export declare type EasyFormFieldProps<P> = IEasyFormFiledBaseProps & P;
/** 内部类型的数据格式，比如list和group类型，需要有自己的状态，需要额外定义成set类型 */
export declare type EasyFormInternalType<P extends BasicModel<any>> = FieldSetModel<{
    $$type: FieldModel<string>;
    status: FieldModel<Record<string, any>>;
    value: P;
}>;
export declare type NormalEasyFormModel = FieldModel<any>;
export declare type GroupEasyFormModel = FieldSetModel<Record<string, NormalEasyFormModel>>;
export declare type ListEasyFormModel = FieldArrayModel<any>;
export declare type EasyFormModelType = NormalEasyFormModel | GroupEasyFormModel | ListEasyFormModel;
export declare type NormalStatusModel = FieldModel<IFieldStatus>;
export declare type GroupStatusModel = FieldSetModel<Record<string, NormalStatusModel>>;
export declare type ListStatusModel = NormalStatusModel;
export declare type EasyFormStatusModelType = NormalStatusModel | GroupStatusModel | ListStatusModel;
export {};
