import { PureComponent } from 'react';
import { IDayCell } from '@youzan/zan-media-sdk/lib/calendar/src/month';
import { ICalendarPanelProps } from './types';
interface ICalendarPanelState {
    active: Date;
}
export default class CalendarPanel extends PureComponent<ICalendarPanelProps, ICalendarPanelState> {
    static defaultProps: {
        weekStartsOn: number;
    };
    readonly state: {
        active: Date;
    };
    /**
     * 在月份切换的时候，需要判断与前一次 active 的日期之间的月份差
     * 然后计算出现在应该 active 的日期
     */
    static getDerivedStateFromProps(nextProps: ICalendarPanelProps, prevState: ICalendarPanelState): {
        active: Date;
    } | null;
    /**
     * 每日的 cell 点击的时候
     * 需要切换 active
     * 如果点击的不是当前月的日期
     * 需要切换月份
     */
    handleDayClick: (date: Date) => void;
    /**
     * 获取每日 cell 的 className
     * 每个 cell 都有 day
     * 不是本月的，月初之前的和月末之后的加上 disabled
     * 今天的加上 today
     * 上一次点击的加上 active
     */
    getDayCellClassName: (day: IDayCell) => string;
    renderDays(): JSX.Element;
    renderCell(): JSX.Element;
    render(): JSX.Element;
}
export {};
