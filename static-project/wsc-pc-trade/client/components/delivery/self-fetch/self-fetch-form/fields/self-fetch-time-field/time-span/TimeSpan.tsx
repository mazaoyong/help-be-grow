import React, { Component } from 'react';
import { Form } from '@zent/compat';

import TimePicker from 'components/time-picker';
import { ITimePickerItem } from 'components/time-picker/type';

export interface IProps {
  value: ITimePickerItem[];
  onChange: (v: ITimePickerItem[]) => void;
}
/**
 * 自提时段字段组件
 */
class TimeSpanComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  onChange = data => {
    this.props.onChange(data);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="self-fetch-time-field">
        <TimePicker value={value} onChange={this.onChange} />
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(TimeSpanComponent);
