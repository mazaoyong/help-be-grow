import React, { PureComponent } from 'react';
import {
  format,
  isSameDay,
  isSameMonth,
  differenceInCalendarMonths,
  addMonths
} from 'date-fns';
import cx from 'classnames';
// getMonthCalender, { getWeeks, IDayCell }
import { calendar } from '@youzan/zan-media-sdk';
import { IDayCell } from '@youzan/zan-media-sdk/lib/calendar/src/month';

import { ICalendarPanelProps } from './types';

interface ICalendarPanelState {
  active: Date;
}

export default class CalendarPanel extends PureComponent<
  ICalendarPanelProps,
  ICalendarPanelState
> {
  static defaultProps = {
    weekStartsOn: 1
  };

  readonly state = {
    active: new Date()
  };

  /**
   * 在月份切换的时候，需要判断与前一次 active 的日期之间的月份差
   * 然后计算出现在应该 active 的日期
   */
  static getDerivedStateFromProps(
    nextProps: ICalendarPanelProps,
    prevState: ICalendarPanelState
  ) {
    if (!isSameMonth(nextProps.current, prevState.active)) {
      const diffMonth = differenceInCalendarMonths(
        nextProps.current,
        prevState.active
      );

      return {
        active: addMonths(prevState.active, diffMonth)
      };
    }
    return null;
  }

  /**
   * 每日的 cell 点击的时候
   * 需要切换 active
   * 如果点击的不是当前月的日期
   * 需要切换月份
   */
  handleDayClick = (date: Date) => {
    if (this.props.onSelect) {
      this.setState({
        active: date
      });

      this.props.onSelect(date);

      if (!isSameMonth(date, this.props.current) && this.props.onMonthChange) {
        this.props.onMonthChange(date);
      }
    }
  };

  /**
   * 获取每日 cell 的 className
   * 每个 cell 都有 day
   * 不是本月的，月初之前的和月末之后的加上 disabled
   * 今天的加上 today
   * 上一次点击的加上 active
   */
  getDayCellClassName = (day: IDayCell) => {
    const { date, today, week, preMonth, nextMonth } = day;

    return cx({
      day: true,
      [week]: true,
      preMonth,
      nextMonth,
      today,
      active: isSameDay(date, this.state.active)
    });
  };

  // 头部 周一～周日
  renderDays() {
    const calendarDays = calendar.getWeeks(this.props.weekStartsOn);

    return (
      <div className="ebiz-calendar__panel__days ebiz-calendar__panel__row">
        {calendarDays.map(day => {
          return (
            <div
              className="ebiz-calendar__panel__col ebiz-calendar__panel__col-center"
              key={day}
            >
              周{day}
            </div>
          );
        })}
      </div>
    );
  }

  // 计算每天的小单元格并渲染
  renderCell() {
    const { current, weekStartsOn } = this.props;
    const calendarData = calendar.getMonthCalender(current, weekStartsOn);

    return (
      <div className="ebiz-calendar__panel__body">
        {calendarData.map((week, i) => {
          return (
            <div className="ebiz-calendar__panel__row" key={i}>
              {week.map(day => {
                return (
                  <div
                    className="ebiz-calendar__panel__col ebiz-calendar__panel__body-cell full-calendar"
                    key={day.date.getTime()}
                  >
                    <div
                      className={this.getDayCellClassName(day)}
                      onClick={() => this.handleDayClick(day.date)}
                    >
                      {this.props.dateFullCellRender ? (
                        this.props.dateFullCellRender(day.date)
                      ) : (
                        <div className="full-calendar__cell">
                          <p className="full-calendar__cell__header">
                            {format(day.date, 'D')}
                          </p>
                          <div className="full-calendar__content">
                            {this.props.dateCellRender &&
                              this.props.dateCellRender(day.date)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="ebiz-calendar__panel">
        {this.renderDays()}
        {this.renderCell()}
      </div>
    );
  }
}
