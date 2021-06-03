
import { TimePicker, Form } from '@zent/compat';
// 打卡时长
import React, { Component } from 'react';

import { Radio } from 'zent';

const { getControlGroup } = Form;
const RadioGroup = Radio.Group;

class AlertTime extends Component {
  // 单选框改变事件
  onRadioChange = evt => {
    this.props.onChange(
      {
        type: evt.target.value,
        time: '',
      },
      { merge: true }
    );
  };

  onChangeTime = val => {
    this.props.onChange({ time: val }, { merge: true });
  };

  render() {
    const { type, time } = this.props.value;
    const disabled = this.props.disabled;

    return (
      <div className="alert-time-field">
        <RadioGroup value={type} disabled={disabled} onChange={this.onRadioChange}>
          <Radio value={0}>不提醒</Radio>
          <br />
          <Radio value={1}>每日</Radio>
          <div className="field-inline">
            <TimePicker
              value={time}
              disabled={type !== 1 || disabled}
              onChange={this.onChangeTime}
              minuteStep={5}
            />
            <span> 微信提醒未打卡学员</span>
          </div>
        </RadioGroup>
      </div>
    );
  }
}

export default getControlGroup(AlertTime);
