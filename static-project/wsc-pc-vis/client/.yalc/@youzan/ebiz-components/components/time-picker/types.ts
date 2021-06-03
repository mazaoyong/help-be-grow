export interface ITimePickerValue {
  hour?: number;
  minute?: number;
  second?: number;
}

// 选择器类型
export type timePickerType =
  | 'HH'
  | 'mm'
  | 'ss'
  | 'HH:mm'
  | 'mm:ss'
  | 'HH:mm:ss';
export type valueType = string | number | number[] | ITimePickerValue;

export interface IPickerType {
  hour: boolean;
  minute: boolean;
  second: boolean;
}

interface IDisabledTime {
  disabledHours?: ((val: number) => boolean) | number[]; // 禁用的小时范围
  disabledMinutes?: ((val: number) => boolean) | number[]; // 禁用的分钟范围
  disabledSeconds?: ((val: number) => boolean) | number[]; // 禁用的秒范围
  disabledAll?:
    | ((val: Required<ITimePickerValue>) => boolean)
    | Partial<ITimePickerValue>[];
}

export interface ITimePickerProps<T extends valueType> {
  value: T; // 值
  onChange: (value: T) => void;
  name: string; // input 的 name 属性
  type?: timePickerType; // 选择时间类型
  placeholder?: string; // 值为空时显示提示文字
  disabled?: boolean; // 是否禁用
  width?: string | number;
  prefix?: string; // 自定义 class 前缀
  clearable?: boolean; // 显示清除按钮
  disabledTime?: IDisabledTime; // 时间禁用方法
  hideTime?: IDisabledTime; // 时间隐藏方法
  onBeforeConfirm?: (value: T) => boolean; // 用户点击确认前的回调函数，返回 true 表示可以确认，false 表示不能确认
}

export interface ITimePickerPanelProps {
  type: IPickerType;
  value: ITimePickerValue;
  onSubmit: (val: Required<ITimePickerValue>) => void;
  // 时间禁用方法
  disabledTime?: IDisabledTime; // 时间禁用方法
  hideTime?: IDisabledTime; // 时间隐藏方法
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
