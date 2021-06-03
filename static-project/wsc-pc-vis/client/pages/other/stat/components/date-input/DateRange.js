import { DatePicker, WeekPicker, MonthPicker, DateRangePicker, QuarterPicker } from '@zent/compat';
import React, { Component } from 'react';
import getCurrentDay from 'zan-utils/date/getCurrentDay';
import startOfYesterday from 'date-fns/start_of_yesterday';
import startOfWeek from 'date-fns/start_of_week';
import startOfMonth from 'date-fns/start_of_month';
import startOfQuarter from 'date-fns/start_of_quarter';
import endOfWeek from 'date-fns/end_of_week';
import endOfMonth from 'date-fns/end_of_month';
import endOfQuarter from 'date-fns/end_of_quarter';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import subWeeks from 'date-fns/sub_weeks';
import subMonths from 'date-fns/sub_months';
import subQuarters from 'date-fns/sub_quarters';
import max from 'date-fns/max';
import min from 'date-fns/min';
import format from 'date-fns/format';
import isSunday from 'date-fns/is_sunday';
import isLastDayOfMonth from 'date-fns/is_last_day_of_month';
import './style.scss';

const YESTERDAY = startOfYesterday();

const getMonthDate = month => {
  // '2017-08'转成['2017-08-01', '2017-08-31']
  if (!month) return ['', ''];
  let time = new Date(month);
  let startDate = getCurrentDay(startOfMonth(time));
  let endDate = getCurrentDay(endOfMonth(time));
  return [startDate, endDate];
};

// eslint-disable-next-line
export default class DateRange extends Component {
  state = {
    startDay: '',
    endDay: '',
  };

  componentWillMount() {
    this.setDefaultDate(false);
  }

  componentDidUpdate(prevProps) {
    const { active, resetTrigger } = this.props;
    const { active: lastActive, resetTrigger: lastResetTrigger } = prevProps;
    if (
      (active && active !== lastActive && !(!resetTrigger && lastResetTrigger)) ||
      (resetTrigger && resetTrigger !== lastResetTrigger)) {
      this.setDefaultDate(true);
    }
  }

  lastCycleInvalid(statsValid, type) {
    return statsValid && !statsValid[type === 'range' ? 'day' : type];
  }

  setDefaultDate(switchType) {
    let {
      startDay,
      endDay,
      lastDay,
      type,
      duration,
      statsValid,
      keepDayWhileChangeType,
    } = this.props;
    if (!keepDayWhileChangeType) {
      if (type !== 'recent') {
        [startDay, endDay] = this.getDefaultTime(switchType);
      } else {
        // 最近n天
        endDay = this.lastCycleInvalid(statsValid, type)
          ? subDays(YESTERDAY, 1)
          : new Date(lastDay);
        startDay = getCurrentDay(subDays(endDay, duration));
        endDay = getCurrentDay(startDay);
      }
    }
    this.setState({ startDay, endDay });
    this.props.onChange([startDay, endDay]);
  }

  getDefaultTime = (switchType) => {
    const { startDay, endDay, statsValid, type, lastDay, keepDayWhileChangeType } = this.props;
    const startDate = startDay ? new Date(startDay) : null;
    const endDate = endDay ? new Date(endDay) : null;
    const validEnd =
      this.lastCycleInvalid(statsValid, type)
        ? subDays(YESTERDAY, 1)
        : new Date(lastDay);
    let defaultDay = validEnd;
    let defaultRangeStart = validEnd;
    let defaultRangeEnd = validEnd;
    let defaulWeek = subWeeks(addDays(validEnd, 1), 1);
    let defaulMonth = subMonths(addDays(validEnd, 1), 1);
    let defaulQuarter = subQuarters(addDays(validEnd, 1), 1);
    if ((startDate || endDate) && (keepDayWhileChangeType && !switchType)) {
      defaultDay = startDate || endDate;
      defaultRangeStart = startDate;
      defaultRangeEnd = endDate;
      defaulWeek = subWeeks(startDate || endDate, 0);
      defaulMonth = subMonths(startDate || endDate, 0);
      defaulQuarter = subQuarters(startDate || endDate, 0);
    }
    let defaulStart;
    let defaulEnd;
    switch (type) {
      case 'day':
        defaulEnd = defaulStart = getCurrentDay(defaultDay);
        break;
      case 'week':
        defaulStart = getCurrentDay(startOfWeek(defaulWeek, { weekStartsOn: 1 }));
        defaulEnd = getCurrentDay(endOfWeek(defaulWeek, { weekStartsOn: 1 }));
        break;
      case 'month':
        defaulStart = getCurrentDay(startOfMonth(defaulMonth));
        defaulEnd = getCurrentDay(endOfMonth(defaulMonth));
        break;
      case 'quarter':
        defaulStart = getCurrentDay(startOfQuarter(defaulQuarter));
        defaulEnd = getCurrentDay(endOfQuarter(defaulQuarter));
        break;
      case 'range':
        defaulStart = getCurrentDay(defaultRangeStart);
        defaulEnd = getCurrentDay(defaultRangeEnd);
        break;
      case 'now':
        defaulEnd = defaulStart = getCurrentDay(new Date());
        break;
      default:
        break;
    }
    return [defaulStart, defaulEnd];
  };

  getDisabledDate = type => {
    // 根据statsValid查询昨天数据的可用性
    let {
      lastDay,
      validCycle,
      originDay,
      maxSpan,
      includeOriginDay,
      statsValid,
    } = this.props;
    let { startDay, endDay } = this.state;
    const startDate = startDay ? new Date(startDay) : null;
    const endDate = endDay ? new Date(endDay) : null;
    let validCycleExist = typeof validCycle !== 'undefined';
    lastDay =
      this.lastCycleInvalid(statsValid, type)
        ? subDays(YESTERDAY, 1)
        : new Date(lastDay);
    originDay = originDay ? new Date(originDay) : 0;
    if (type !== 'quarter') {
      switch (type) {
        case 'week':
          lastDay = endOfWeek(isSunday(lastDay) ? lastDay : subWeeks(lastDay, 1), {
            weekStartsOn: 1,
          });
          if (validCycleExist) {
            originDay = startOfWeek(subWeeks(lastDay, validCycle - 1), { weekStartsOn: 1 });
          }
          if (includeOriginDay) {
            originDay = startOfWeek(originDay, { weekStartsOn: 1 });
          }
          break;
        case 'month':
          lastDay = isLastDayOfMonth(lastDay) ? lastDay : subMonths(lastDay, 1);
          if (validCycleExist) {
            originDay = subMonths(lastDay, validCycle);
          }
          if (includeOriginDay) {
            originDay = startOfMonth(originDay, 1);
          }
          break;
        case 'recent':
          if (validCycleExist) {
            originDay = subDays(lastDay, validCycle);
          }
          if (includeOriginDay) {
            originDay = subDays(originDay, 1);
          }
          break;
        default:
          if (validCycleExist) {
            originDay = max(subDays(lastDay, validCycle), originDay);
          }
          if (includeOriginDay) {
            originDay = subDays(originDay, 1);
          }
          if (maxSpan) {
            originDay = endDate ? max(subDays(endDate, maxSpan), originDay) : originDay;
            lastDay = startDate ? min(addDays(startDate, maxSpan), lastDay) : lastDay;
          }
          break;
      }
      return d => d.getTime() < originDay || d.getTime() > lastDay;
    }
    // quarter
    return time => {
      const [start, end] = time;
      if (validCycleExist) {
        originDay = startOfQuarter(subQuarters(lastDay, validCycle));
      }
      if (includeOriginDay) {
        originDay = startOfQuarter(originDay);
      }
      return start.getTime() < originDay || end.getTime() > lastDay;
    };
  };

  onChange = time => {
    const { type } = this.props;
    let timeArray;
    switch (type) {
      case 'day':
        timeArray = [time, time];
        break;
      case 'week':
        timeArray = time;
        break;
      case 'month':
        timeArray = getMonthDate(time);
        break;
      case 'range':
        timeArray = time;
        break;
      case 'quarter':
        timeArray = ['', ''];
        if (time[0]) {
          timeArray[0] = format(time[0], 'YYYY-MM-DD');
        }
        if (time[1]) {
          timeArray[1] = format(time[1], 'YYYY-MM-DD');
        }
        break;
      case 'now':
        timeArray = [time, time];
        break;
      default:
        break;
    }
    this.setState({
      startDay: timeArray[0],
      endDay: timeArray[1],
    });
    this.props.onChange(timeArray);
  };

  renderTime() {
    const { type } = this.props;
    switch (type) {
      case 'day':
        // 自然天选择
        return this.renderDay();
      case 'week':
        // 自然周选择
        return this.renderWeek();
      case 'month':
        // 自然月选择
        return this.renderMonth();
      case 'quarter':
        return this.renderQuarter();
      case 'range':
        return this.renderRange();
      case 'recent':
        return this.renderRecent();
      case 'now':
        return this.renderNow();
      default:
        break;
    }
  }

  onRefreshNow = () => {
    this.onChange(getCurrentDay(new Date()));
  };

  renderNow() {
    return (
      <span>
        {format(new Date(), 'YYYY-MM-DD HH:mm:ss')}
        <a className="date-input__range-refresh" onClick={this.onRefreshNow}>
          刷新
        </a>
      </span>
    );
  }

  renderRecent() {
    const { duration } = this.props;
    const { startDay, endDay } = this.state;

    return duration === 1 ? `${startDay}` : `${startDay} 至 ${endDay}`;
  }

  renderDay() {
    const { startDay } = this.state;

    return (
      <DatePicker
        disabledDate={this.getDisabledDate('day')}
        onChange={this.onChange}
        value={startDay}
        format="YYYY-MM-DD"
      />
    );
  }

  renderRange() {
    const { startDay, endDay } = this.state;

    return (
      <DateRangePicker
        className="date-input__range-picker"
        disabledDate={this.getDisabledDate('range')}
        value={[startDay, endDay]}
        onChange={this.onChange}
      />
    );
  }

  renderWeek() {
    const { startDay, endDay } = this.state;

    return (
      <WeekPicker
        disabledDate={this.getDisabledDate('week')}
        value={[startDay, endDay]}
        onChange={this.onChange}
      />
    );
  }

  renderMonth() {
    const { startDay } = this.state;

    return (
      <MonthPicker
        value={startDay}
        onChange={this.onChange}
        disabledDate={this.getDisabledDate('month')}
      />
    );
  }

  renderQuarter() {
    const { startDay } = this.state;

    return (
      <QuarterPicker
        value={startDay}
        onChange={this.onChange}
        valueType="date"
        disabledDate={this.getDisabledDate('quarter')}
      />
    );
  }

  render() {
    return <div className="date-input__range">{this.renderTime()}</div>;
  }
}
