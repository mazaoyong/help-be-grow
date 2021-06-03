import { Select } from '@zent/compat';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import startOfYesterday from 'date-fns/start_of_yesterday';
import getCurrentDay from 'zan-utils/date/getCurrentDay';
import filter from 'lodash/filter';
import cx from 'classnames';
import DateRange from './DateRange';

const YESTERDAY = getCurrentDay(startOfYesterday());
const Option = Select.Option;

export default class DateInput extends Component {
  constructor(props) {
    super(props);
    const { active, config, resetTrigger } = this.props;
    this.state = {
      activeType: active || config[0].type,
      resetTrigger,
    };
  }

  componentDidUpdate(prevProps) {
    const { active, resetTrigger } = this.props;
    if ((active !== prevProps.active) || (resetTrigger && resetTrigger !== prevProps.resetTrigger)) {
      this.setState({ activeType: active });
    }
    if (resetTrigger !== prevProps.resetTrigger) {
      this.setState({ resetTrigger });
    }
  }

  getOptions(config) {
    return config.map((item, i) => {
      const { title, id } = item;
      return (
        <Option value={id} key={i}>
          {title}
        </Option>
      );
    });
  }

  onChangeType = e => {
    const id = e.target.value;
    const { startDay, endDay } = this.refDateInput.state;
    this.props.onChangeType && this.props.onChangeType([startDay, endDay], id);
    this.setState({ activeType: id });
    this.props.onChange && this.props.onChange([[startDay, endDay], id]);
  };

  onChangeTime = timeArr => {
    const { activeType } = this.state;
    this.props.onChangeTime && this.props.onChangeTime(timeArr, activeType);
    this.props.onChange && this.props.onChange([timeArr, activeType]);
  };

  render() {
    const {
      startDay,
      endDay,
      lastDay,
      originDay,
      includeOriginDay,
      title,
      config,
      className,
      keepDayWhileChangeType,
      statsValid,
    } = this.props;
    const { activeType, resetTrigger } = this.state;
    const item = filter(config, { id: activeType })[0] || {};
    const { type, cycle, duration, maxSpan } = item;

    const activeValidCycle = filter(config, { id: activeType })[0].validCycle;
    const cls = cx({
      [`${className}`]: !!className,
      'date-input': true,
    });
    return (
      <div className={cls}>
        <span className="date-input__title">{title}</span>
        <Select
          value={activeType}
          onChange={this.onChangeType}
          className="date-input__select"
          width={105}
          autoWidth
        >
          {this.getOptions(config)}
        </Select>
        <DateRange
          ref={ref => {
            this.refDateInput = ref;
          }}
          active={activeType}
          type={type}
          cycle={cycle}
          duration={duration}
          maxSpan={maxSpan} // DateRangePicker的最长跨度
          startDay={startDay}
          endDay={endDay}
          lastDay={lastDay}
          originDay={originDay}
          validCycle={activeValidCycle}
          includeOriginDay={includeOriginDay}
          keepDayWhileChangeType={keepDayWhileChangeType}
          statsValid={statsValid}
          resetTrigger={resetTrigger}
          onChange={this.onChangeTime}
        />
      </div>
    );
  }
}

DateInput.propTypes = {
  className: PropTypes.string,
  startDay: PropTypes.string,
  endDay: PropTypes.string,
  defaultType: PropTypes.string,
  type: PropTypes.string,
  active: PropTypes.string,
  originDay: PropTypes.string,
  includeOriginDay: PropTypes.bool,
  statsValid: PropTypes.object,
  lastDay: PropTypes.string,
  title: PropTypes.string,
  config: PropTypes.array,
  keepDayWhileChangeType: PropTypes.bool,
  resetTrigger: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeTime: PropTypes.func,
  onChangeType: PropTypes.func,
};

DateInput.defaultProps = {
  lastDay: YESTERDAY,
  className: '',
  keepDayWhileChangeType: false,
};
