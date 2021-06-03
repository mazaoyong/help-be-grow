import { Component } from 'react';
import { ITimePickerPanelCellProps } from './types';
export default class TimePickerPanelCell extends Component<ITimePickerPanelCellProps, {}> {
    ref: HTMLUListElement | null;
    componentDidMount(): void;
    isDisabled: (val: number) => boolean;
    isHide: (val: number) => boolean;
    render(): JSX.Element;
}
