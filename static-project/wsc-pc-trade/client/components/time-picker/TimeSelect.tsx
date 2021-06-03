import React, { Component } from 'react';
import cx from 'classnames';
import { Select, ISelectProps } from 'zent';
import padCharsStart from 'lodash/fp/padCharsStart';

const padLeftZero = padCharsStart('0')(2);
const padTimeLeftZero = (t: number | string) => padLeftZero(t.toString());

interface IProps {
  prefix?: string;
  className?: string;
  time: string;
  active: boolean;
  onChange: (value: string) => void;
}

const HOURS = new Array(24).fill(0).map((_, i) => ({
  value: padTimeLeftZero(i),
  text: padTimeLeftZero(i),
}));

const MINUTES = new Array(60).fill(0).map((_, i) => ({
  value: padTimeLeftZero(i),
  text: padTimeLeftZero(i),
}));

export default class TimeSelect extends Component<IProps> {
  static defaultProps = {
    prefix: 'custom-time-picker-item__time',
  };

  splitTime(time: string) {
    const hour = padTimeLeftZero(time.split(':')[0]);
    const minute = padTimeLeftZero(time.split(':')[1]);

    return [hour, minute];
  }

  handleChange: NonNullable<ISelectProps['onChange']> = (evt, timeArrIndex: number) => {
    const val = evt.target.value;
    const { time, onChange } = this.props;
    const timeArr = this.splitTime(time);

    timeArr[timeArrIndex] = val;

    onChange(timeArr.join(':'));
  };

  render() {
    const { prefix, time, active, className } = this.props;
    const timeArr = this.splitTime(time);
    const cls = cx(prefix, className);

    return (
      <div className={cls}>
        <Select
          disabled={!active}
          data={HOURS}
          onChange={evt => {
            this.handleChange(evt, 0);
          }}
          value={timeArr[0] || HOURS[0]}
          placeholder="00"
        />
        <span className={`${cls}-hour`}>时</span>
        <Select
          disabled={!active}
          data={MINUTES}
          onChange={evt => {
            this.handleChange(evt, 1);
          }}
          value={timeArr[1] || MINUTES[0]}
          placeholder="00"
        />
        <span className={`${cls}-minute`}>分</span>
      </div>
    );
  }
}
