import React, { Component } from 'react';
import { Form } from '@zent/compat';
import {
  DateRangeQuickPicker,
  IDateRangeQuickPickerProps,
  DateRangeQuickPickerChangeCallback,
} from 'zent';
import omit from 'lodash/omit';

const { getControlGroup } = Form;

/**
 * 购买次数form field
 */
type IProps = ZENT_FIELD<IDateRangeQuickPickerProps>;

class DatePickerWrap extends Component<IProps> {
  handleChange: DateRangeQuickPickerChangeCallback = (value, chooseDays) => {
    const { handleChange } = this.props;
    handleChange({
      value,
      chooseDays,
    });
  };

  render() {
    const { dateFormat } = this.props;
    const passableProps = omit(this.props, ['dateFormat', 'onChange']);
    return (
      <DateRangeQuickPicker {...passableProps} onChange={this.handleChange} format={dateFormat} />
    );
  }
}

const DatePickerWrapField = getControlGroup(DatePickerWrap);

export default DatePickerWrapField;
