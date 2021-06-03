
import { DatePicker, Pop, Form } from '@zent/compat';
import React, { Component } from 'react';

const { getControlGroup } = Form;

class DateRangeWrapper extends Component {
  onDateChange = (date, pos) => {
    let value = this.props.value;
    value[pos] = date;
    this.props.onChange(value);
  };

  render() {
    const {
      disabled,
      disabledMsg,
      value,
      formatTime = 'YYYY-MM-DD HH:mm:ss',
      showTime = true,
      placeholder = ['开始日期', '结束日期'],
    } = this.props;
    const renderedBody = (
      <div>
        <DatePicker
          showTime={showTime}
          format={formatTime}
          valueType="number"
          disabled={disabled[0]}
          value={value[0]}
          max={value[1]}
          min={Date.now()}
          placeholder={placeholder[0]}
          canClear
          onChange={date => this.onDateChange(date, 0)}
        />
        &nbsp; 至 &nbsp;
        <DatePicker
          showTime={showTime}
          format={formatTime}
          valueType="number"
          min={disabled[0] ? value[1] : value[0]}
          disabled={disabled[1]}
          value={value[1]}
          placeholder={placeholder[1]}
          canClear
          onChange={date => this.onDateChange(date, 1)}
        />
      </div>
    );
    return disabledMsg ? (
      <Pop trigger="hover" position="top-left" block content={disabledMsg}>
        {renderedBody}
      </Pop>
    ) : (
      renderedBody
    );
  }
}

export default getControlGroup(DateRangeWrapper);
