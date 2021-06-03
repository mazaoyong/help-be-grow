import { Component } from 'react';
import { ISortData } from './utils/sortdata';
import './style/schedule.scss';
export interface ScheduleProps {
    type: 'day' | 'week' | 'month';
    current: Date;
    data: {
        [key: string]: ISortData[];
    };
    rowHeight?: number;
    max?: number;
    interval?: number;
    timeLineStart?: string;
    timelineEnd?: string;
    view?: 'timeline' | 'teacher' | 'classroom' | 'class';
    renderField: (item: any) => JSX.Element;
    weekStartsOn?: number;
    onMonthChange?: (date: Date) => void;
    dateCellRender?: (data: ISortData[], date: Date) => JSX.Element;
    dateFullCellRender?: (data: ISortData[], date: Date) => JSX.Element;
    renderBackRow?: (time: Date) => JSX.Element;
    onSelect?: (date: Date) => void;
    onShowMoreClick?: (date: Date) => void;
    renderWeekDays?: (date: Date) => JSX.Element;
    endDrag?: (startTime: number, endTime: number) => void;
}
export default class Schedule extends Component<ScheduleProps, {}> {
    renderMonth(): JSX.Element;
    renderWeek(): JSX.Element;
    renderDay(): JSX.Element;
    render(): JSX.Element;
}
