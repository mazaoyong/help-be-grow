import React, { Component } from 'react';
import formatDate from 'zan-utils/date/formatDate';
import getCurrentWeek from 'zan-utils/date/getCurrentWeek';
import { Icon } from 'zent';

export default class WeekTitle extends Component {
  render() {
    const { time, count, callback = () => {} } = this.props;
    const week = getCurrentWeek(time);
    const date = formatDate(time, 'MM-DD');
    const isToday = formatDate(time, 'YYYY-MM-DD') === formatDate(new Date(), 'YYYY-MM-DD');
    return (
      <div className="week-title">
        {isToday && <Icon className="week-title__icon" type='caret-down'/>}
        <div className="week-title__name">{week}({date})</div>
        <div className={`week-title__num ${!count ? 'deprecated' : ''}`} onClick={count ? callback : null}>共{count}个预约</div>
      </div>
    );
  }
}
