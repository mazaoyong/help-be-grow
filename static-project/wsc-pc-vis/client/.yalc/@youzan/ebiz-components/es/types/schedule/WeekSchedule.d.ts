import { Component } from 'react';
import { ISortData } from './utils/sortdata';
import './style/week-schedule.scss';
export declare enum ViewWords {
    timeline = "\u65F6\u95F4",
    teacher = "\u8001\u5E08",
    classroom = "\u6559\u5BA4",
    class = "\u73ED\u7EA7"
}
export declare type IWeekScheduleProps = {
    type: 'week';
    max?: number;
    current: Date;
    data: {
        [key: string]: ISortData[];
    };
    weekStartsOn?: number;
    interval: number;
    rowHeight: number;
    timeLineStart: string;
    timeLineEnd: string;
    view?: 'timeline' | 'teacher' | 'classroom' | 'class';
    renderWeekDays?: (date: Date) => JSX.Element;
    renderField: (item: object) => JSX.Element;
    renderBackRow?: (time: Date) => JSX.Element;
    endDrag?: (startTime: number, endTime: number) => void;
    onShowMoreClick?: (date: Date) => void;
};
declare class WeekSchedule extends Component<IWeekScheduleProps, {}> {
    static readonly defaultProps: Partial<IWeekScheduleProps>;
    state: {
        hoverList: never[];
    };
    get timeline(): number[];
    get start(): string;
    get end(): string;
    getTimeline(day: Date): number[];
    get weeks(): import("@youzan/zan-media-sdk/lib/calendar/src/week").IWeekDayCell[];
    get data(): any;
    getViewsBody(): JSX.Element | null;
    getTimelineBody(): JSX.Element;
    render(): JSX.Element;
}
export default WeekSchedule;
