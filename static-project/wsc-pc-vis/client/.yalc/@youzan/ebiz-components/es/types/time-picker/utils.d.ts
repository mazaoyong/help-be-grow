import { ITimePickerValue, IPickerType } from './types';
export declare function generateArray(n: number): number[];
export declare function formatOptions(n: number): string;
export declare function formatValueString(valueObj: ITimePickerValue, picker: IPickerType): string;
export declare function isEmpty(val: ITimePickerValue): boolean;
