export interface ITimePickerValue {
    hour?: number;
    minute?: number;
    second?: number;
}
export declare type timePickerType = 'HH' | 'mm' | 'ss' | 'HH:mm' | 'mm:ss' | 'HH:mm:ss';
export declare type valueType = string | number | number[] | ITimePickerValue;
export interface IPickerType {
    hour: boolean;
    minute: boolean;
    second: boolean;
}
interface IDisabledTime {
    disabledHours?: ((val: number) => boolean) | number[];
    disabledMinutes?: ((val: number) => boolean) | number[];
    disabledSeconds?: ((val: number) => boolean) | number[];
    disabledAll?: ((val: Required<ITimePickerValue>) => boolean) | Partial<ITimePickerValue>[];
}
export interface ITimePickerProps<T extends valueType> {
    value: T;
    onChange: (value: T) => void;
    name: string;
    type?: timePickerType;
    placeholder?: string;
    disabled?: boolean;
    width?: string | number;
    prefix?: string;
    clearable?: boolean;
    disabledTime?: IDisabledTime;
    hideTime?: IDisabledTime;
    onBeforeConfirm?: (value: T) => boolean;
}
export interface ITimePickerPanelProps {
    type: IPickerType;
    value: ITimePickerValue;
    onSubmit: (val: Required<ITimePickerValue>) => void;
    disabledTime?: IDisabledTime;
    hideTime?: IDisabledTime;
}
export interface ITimePickerPanelCellProps {
    value: number;
    options: number[];
    onChange: (val: number) => void;
    disabledTime?: ((val: number) => boolean) | number[];
    hideTime?: ((val: number) => boolean) | number[];
    disabledAllTime: (val: number) => boolean;
    hideAllTime: (val: number) => boolean;
}
export {};
