import React, { Component, ReactNode } from 'react';
import { IInputProps, IRadioEvent, INumberInputProps } from 'zent';
import './RadioInput.scss';
interface IRadioInputDataBase {
    value: number | string;
    label: ReactNode | ReactNode[];
    desc?: ReactNode;
}
interface IRadioInputData extends IRadioInputDataBase {
    type: 'number';
    inputProps?: IInputProps;
}
interface IRadioInputNumberData extends IRadioInputDataBase {
    type: 'number-input';
    inputProps?: INumberInputProps;
}
interface IRadioInputValue {
    type: string | number;
    input: string;
}
interface IProps {
    className: string;
    layout: 'row' | 'column';
    data: (IRadioInputData | IRadioInputNumberData)[];
    value: IRadioInputValue;
    disabled?: boolean;
    onChange: (data: IRadioInputValue) => void;
}
declare class RadioInput extends Component<IProps> {
    onRadioChange: (e: IRadioEvent<React.ReactText>) => void;
    onInputChange: (e: import("zent").IInputClearEvent | React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    onNumberInputChange: (value: any) => void;
    render(): JSX.Element;
}
export default RadioInput;
