import { PureComponent } from 'react';
import 'zent/css/index.css';
import { ICalendarHeaderProps } from './types';
export default class CalendarHeader extends PureComponent<ICalendarHeaderProps, {}> {
    get current(): string;
    prevMonth: () => void;
    nextMonth: () => void;
    render(): JSX.Element;
}
