import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import TimePicker from 'components/time-picker';
import { ITimePickerItem } from 'components/time-picker/type';

export interface IProps {
  value: ITimePickerItem[];
  onChange: (v: ITimePickerItem[]) => void;
}

/**
 * 配送时段字段组件
 */
class DeliveryTimes extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  handleChange = data => {
    this.props.onChange(data);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="custom-delivery-times">
        <TimePicker value={value} onChange={this.handleChange} />
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(DeliveryTimes);
