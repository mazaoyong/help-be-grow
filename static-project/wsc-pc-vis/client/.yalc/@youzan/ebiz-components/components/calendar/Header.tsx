import React, { PureComponent } from 'react';
import { Icon } from 'zent';
import { format, subMonths, addMonths } from 'date-fns';
import 'zent/css/index.css';

import { ICalendarHeaderProps } from './types';

export default class CalendarHeader extends PureComponent<
  ICalendarHeaderProps,
  {}
> {
  get current(): string {
    const { current } = this.props;
    return format(current, 'YYYY-MM');
  }

  // 上一月
  prevMonth = () => {
    this.props.onMonthChange(subMonths(this.props.current, 1));
  };

  // 下一月
  nextMonth = () => {
    this.props.onMonthChange(addMonths(this.props.current, 1));
  };

  render() {
    return (
      <div className="ebiz-calendar__header">
        <div className="ebiz-calendar__header__operate">
          <div className="prev" onClick={this.prevMonth}>
            <Icon type="right" />
          </div>
          <div>{this.current}</div>
          <div className="next" onClick={this.nextMonth}>
            <Icon type="right" />
          </div>
        </div>
      </div>
    );
  }
}
