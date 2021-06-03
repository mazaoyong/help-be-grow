import { IOption } from '../types';
export declare function setSelectedFlag(options: IOption[], selectedOpts: IOption | IOption[] | undefined, keyboardSelect: number): IOption[];
export declare function getEqualOptionIndex(currentOpt: IOption, options: IOption[] | undefined): number;
export declare function getNewSelectedOptions(deleteOption: IOption | undefined, selectedOpts: IOption | IOption[] | undefined): IOption[] | undefined;
