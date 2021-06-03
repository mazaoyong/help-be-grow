import { DatePicker } from '@zent/compat';
import React, { Component } from 'react';
import formatDate from 'zan-utils/date/formatDate';
import parseDate from 'zan-utils/date/parseDate';

const weekMs = 7 * 24 * 60 * 60 * 1000;
const dayMs = 1 * 24 * 60 * 60 * 1000;

export default class WeekQuickPicker extends Component {
  onChange = (value, type) => {
    const { onChange } = this.props;
    let dataRange = [];
    if (type === 'start') {
      dataRange = [value, formatDate(+parseDate(value, 'YYYY-MM-DD') + weekMs, 'YYYY-MM-DD')];
    } else {
      dataRange = [formatDate(+parseDate(value, 'YYYY-MM-DD') - weekMs, 'YYYY-MM-DD'), value];
    }

    onChange(dataRange);
  };

  preDay = () => {
    const { value, onChange } = this.props;
    onChange([
      formatDate(+parseDate(value[0], 'YYYY-MM-DD') - dayMs, 'YYYY-MM-DD'),
      formatDate(+parseDate(value[1], 'YYYY-MM-DD') - dayMs, 'YYYY-MM-DD'),
    ]);
  };

  nextDay = () => {
    const { value, onChange } = this.props;
    onChange([
      formatDate(+parseDate(value[0], 'YYYY-MM-DD') + dayMs, 'YYYY-MM-DD'),
      formatDate(+parseDate(value[1], 'YYYY-MM-DD') + dayMs, 'YYYY-MM-DD'),
    ]);
  };

  thisWeek = () => {
    let day = new Date().getDay();
    day === 0 && (day = 7);
    day -= 1;
    const { onChange } = this.props;
    onChange([
      formatDate(Date.now() - dayMs * day, 'YYYY-MM-DD'),
      formatDate(Date.now() - dayMs * day + dayMs * 6, 'YYYY-MM-DD'),
    ]);
  };

  nextWeek = () => {
    let day = new Date().getDay();
    day === 0 && (day = 7);
    day -= 1;
    const { onChange } = this.props;
    onChange([
      formatDate(Date.now() - dayMs * day + dayMs * 7, 'YYYY-MM-DD'),
      formatDate(Date.now() - dayMs * day + dayMs * 13, 'YYYY-MM-DD'),
    ]);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="week-quick-picker">
        <span
          className="week-quick-picker__icon week-quick-picker__icon-left"
          onClick={this.preDay}
        />
        <DatePicker
          value={value[0]}
          onChange={value => this.onChange(value, 'start')}
          format="YYYY-MM-DD"
          canClear={false}
        />
        <span className="week-quick-picker__gap">至</span>
        <DatePicker
          value={value[1]}
          onChange={value => this.onChange(value, 'end')}
          format="YYYY-MM-DD"
          canClear={false}
        />
        <span
          className="week-quick-picker__icon week-quick-picker__icon-right"
          onClick={this.nextDay}
        />
        <span className="date-quick-picker__quick-btn" onClick={this.thisWeek}>
          本周
        </span>
        <span className="week-quick-picker__quick-btn" onClick={this.nextWeek}>
          下周
        </span>
      </div>
    );
  }
}
