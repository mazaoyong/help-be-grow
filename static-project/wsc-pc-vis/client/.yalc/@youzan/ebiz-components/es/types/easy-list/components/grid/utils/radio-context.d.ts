import React from 'react';
import { IEasyGridSelection } from '../../../types/grid';
declare type GetRadioPropsType = Required<IEasyGridSelection>['getCheckboxProps'];
interface IEasyGridRadioSelectCtx {
    selected: any | undefined;
    setSelect(index: number, row: any): void;
    getRadioProps: GetRadioPropsType;
}
export declare const RadioContext: React.Context<IEasyGridRadioSelectCtx>;
interface IRadioContextProps {
    getRadioProps: GetRadioPropsType;
    handleSelect: IEasyGridSelection['onSelect'];
    selectedRowKey?: any;
}
export declare const RadioContextProvider: React.FC<IRadioContextProps>;
export {};
