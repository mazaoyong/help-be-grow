
import { DatePicker, Form } from '@zent/compat';
import React, { Component } from 'react';
import SelectTimeReserve from '../../select-time-reserve';
import formatDate from 'zan-utils/date/formatDate';

const { getControlGroup } = Form;

class InputDateTimeReserve extends Component {
  onDatePickerChange = date => {
    const { onChange, value } = this.props;
    onChange({ ...value, date });
  };

  onReserveTimeChange = time => {
    const { onChange, value } = this.props;
    onChange({ ...value, time });
  };

  render() {
    const { value } = this.props;
    const dateNow = new Date();
    const isToday = formatDate(dateNow, 'YYYY-MM-DD') === value.date;
    return (
      <div className="input-date-time-reserve">
        <DatePicker
          min={dateNow}
          value={value.date}
          onChange={this.onDatePickerChange}
          valueType="string"
        />
        <SelectTimeReserve
          isToday={isToday}
          canChoose={!!value.date}
          value={value.time}
          onChange={this.onReserveTimeChange}
        />
      </div>
    );
  }
}

const InputDateTimeReserveField = getControlGroup(InputDateTimeReserve);

export default InputDateTimeReserveField;
