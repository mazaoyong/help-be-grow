
import { DateRangePicker, Form } from '@zent/compat';
import React, { Component } from 'react';
import classNames from 'classnames';
import { getMilliSecond } from '../../utils';

const { getControlGroup } = Form;

class DateRangeQuickPicker extends Component {
  state = {
    quickActiveIndex: '',
  };
  onChangeRange = val => {
    this.setState({ quickActiveIndex: '' });
    const { onChange } = this.props;
    onChange(val);
  };

  onQuickChange = (val, index) => {
    const { onChange } = this.props;
    this.setState({ quickActiveIndex: index });
    // 对preset的value做下计算
    onChange([getMilliSecond(val[0]), getMilliSecond(val[1]) - 1000]);
  };

  disabledRangeDate = (val, type) => {
    const { value } = this.props;
    if (type === 'start') {
      if (value[1]) {
        return +val > +value[1];
      }
    } else if (type === 'end') {
      if (value[0]) {
        return +val < +value[0];
      }
    }

    return false;
  };
  render() {
    const { quickActiveIndex } = this.state;
    const { dateFormat, value, preset = [], ...pickerProps } = this.props;
    return (
      <div className="date-range-quick-picker">
        <DateRangePicker
          format={dateFormat}
          showTime
          valueType="number"
          value={value}
          disabledDate={this.disabledRangeDate}
          {...pickerProps}
          onChange={this.onChangeRange}
        />
        <div className="date-range-quick-picker__actions">
          {preset.map((item, index) => {
            const itemClass = classNames({
              'date-range-quick-picker__action': true,
              'date-range-quick-picker__action-active': quickActiveIndex === index,
            });
            return (
              <span
                key={index}
                className={itemClass}
                onClick={() => this.onQuickChange(item.value, index)}
              >
                {item.text}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

const DateRangeQuickPickerField = getControlGroup(DateRangeQuickPicker);

export default DateRangeQuickPickerField;
