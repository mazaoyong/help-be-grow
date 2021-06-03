import { DatePicker } from '@zent/compat';
import React, { Component } from 'react';
import { Icon } from 'zent';
import formatDate from 'zan-utils/date/formatDate';
import parseDate from 'zan-utils/date/parseDate';

const oneDayMs = 24 * 60 * 60 * 1000;

export default class DateQuickPicker extends Component {
  preDay = () => {
    const { value, onChange } = this.props;
    onChange('dateValue', formatDate(parseDate(value, 'YYYY-MM-DD') - oneDayMs, 'YYYY-MM-DD'));
  };

  nextDay = () => {
    const { value, onChange } = this.props;
    onChange('dateValue', formatDate(+parseDate(value, 'YYYY-MM-DD') + oneDayMs, 'YYYY-MM-DD'));
  };

  today = () => {
    this.props.onChange('dateValue', formatDate(new Date(), 'YYYY-MM-DD'));
  };

  tomorrow = () => {
    this.props.onChange('dateValue', formatDate(Date.now() + oneDayMs, 'YYYY-MM-DD'));
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <div className="date-quick-picker">
        {/* <span
          className="date-quick-picker__icon date-quick-picker__icon-left"
          onClick={this.preDay}
        /> */}
        <Icon
          type="right"
          className="date-quick-picker__icon date-quick-picker__icon-left"
          onClick={this.preDay}
        />
        <DatePicker
          value={value}
          onChange={value => onChange('dateValue', value)}
          canClear={false}
        />
        {/* <span
          className="date-quick-picker__icon date-quick-picker__icon-right"
          onClick={this.nextDay}
        /> */}
        <Icon
          type="right"
          className="date-quick-picker__icon date-quick-picker__icon-right"
          onClick={this.nextDay}
        />
        <span className="date-quick-picker__quick-btn" onClick={this.today}>
          今天
        </span>
        <span className="date-quick-picker__quick-btn" onClick={this.tomorrow}>
          明天
        </span>
      </div>
    );
  }
}
