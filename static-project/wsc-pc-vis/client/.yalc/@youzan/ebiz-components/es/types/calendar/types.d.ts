/// <reference types="react" />
export declare type ICalendarProps = ICalendarHeaderProps & ICalendarPanelProps;
export interface ICalendarHeaderProps {
    current: Date;
    onMonthChange: (date: Date) => void;
}
export interface ICalendarPanelProps {
    current: Date;
    weekStartsOn: number;
    onMonthChange?: (date: Date) => void;
    dateCellRender?: (date: Date) => JSX.Element;
    dateFullCellRender?: (date: Date) => JSX.Element;
    onSelect?: (date: Date) => void;
}
