
import { DatePicker, Pop, Form } from '@zent/compat';
import React, { Component } from 'react';

const { getControlGroup } = Form;

const min = new Date();
const showTime = true;

class TimeField extends Component {
  onChange = value => {
    this.props.onChange(value);
  };
  render() {
    const disabled = new Date(this.props.self.state.live_start_at) < new Date();
    let datePicker = (
      <DatePicker
        disabled={disabled}
        onChange={this.onChange}
        value={this.props.value}
        showTime={showTime}
        format="YYYY-MM-DD HH:mm:ss"
        min={min}
      />
    );
    if (disabled) {
      datePicker = (
        <Pop trigger="hover" content="已开始的直播不能修改时间哦">
          <div>{datePicker}</div>
        </Pop>
      );
    }
    return <div>{datePicker}</div>;
  }
}

export default getControlGroup(TimeField);
