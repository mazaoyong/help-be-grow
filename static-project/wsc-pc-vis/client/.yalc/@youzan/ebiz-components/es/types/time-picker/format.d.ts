import { timePickerType, ITimePickerValue, valueType, IPickerType } from './types';
export declare const formatType: (type: timePickerType) => IPickerType;
export declare function formatValue(value: valueType, picker: IPickerType): ITimePickerValue;
export declare function formatResult<T extends valueType>(value: T, result: Required<ITimePickerValue>, picker: IPickerType): T;
