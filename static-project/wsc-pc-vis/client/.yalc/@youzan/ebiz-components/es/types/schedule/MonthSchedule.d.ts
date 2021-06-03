import { Component } from 'react';
import { ISortData } from './utils/sortdata';
import './style/month-schedule.scss';
export interface IMonthScheduleProps {
    type: 'month';
    current: Date;
    data: {
        [key: string]: ISortData[];
    };
    weekStartsOn?: number;
    onMonthChange?: (date: Date) => void;
    dateCellRender?: (data: ISortData[], date: Date) => JSX.Element;
    dateFullCellRender?: (data: ISortData[], date: Date) => JSX.Element;
    onSelect?: (date: Date) => void;
}
export default class MonthSchedule extends Component<IMonthScheduleProps, {}> {
    dateCellRender: (date: Date) => JSX.Element;
    dateFullCellRender: (date: Date) => JSX.Element;
    render(): JSX.Element;
}
