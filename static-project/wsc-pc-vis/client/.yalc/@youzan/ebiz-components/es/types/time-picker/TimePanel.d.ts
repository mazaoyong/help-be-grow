import { Component } from 'react';
import { ITimePickerPanelProps, ITimePickerValue } from './types';
declare class TimePickerPanel extends Component<ITimePickerPanelProps, Required<ITimePickerValue>> {
    constructor(props: ITimePickerPanelProps);
    disabledAllTime: (val: ITimePickerValue) => boolean;
    hideAllTime: (val: ITimePickerValue) => boolean;
    render(): JSX.Element;
}
export default TimePickerPanel;
