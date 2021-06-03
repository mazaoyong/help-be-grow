import { Component } from 'react';
import { ISortData } from './utils/sortdata';
import './style/day-schedule.scss';
export declare type IDayScheduleProps = {
    type: 'day';
    current: Date;
    data: ISortData[];
    max?: number;
    rowHeight: number;
    interval: number;
    timeLineStart: string;
    timeLineEnd: string;
    renderField: (item: object) => JSX.Element;
    renderBackRow?: (time: Date) => JSX.Element;
    endDrag?: (startTime: number, endTime: number) => void;
};
export default class DaySchedule extends Component<IDayScheduleProps, {}> {
    static readonly defaultProps: Partial<IDayScheduleProps>;
    state: {
        hoverList: never[];
    };
    get timeline(): number[];
    get start(): string;
    get end(): string;
    get data(): ISortData[][];
    render(): JSX.Element;
}
