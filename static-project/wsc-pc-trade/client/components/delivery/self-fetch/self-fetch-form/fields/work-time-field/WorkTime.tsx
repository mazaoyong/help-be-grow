import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import TimePicker from 'components/time-picker';
import { ITimePickerItem } from 'components/time-picker/type';

export interface IProps {
  value: ITimePickerItem[];
  onChange: (v: ITimePickerItem[]) => void;
}

/**
 * 接待时间字段组件
 */
class WorkTimeComponent extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  onChange = data => {
    this.props.onChange(data);
  };

  render() {
    const { value } = this.props;

    return (
      <div className="work-time-field">
        <TimePicker value={value} onChange={this.onChange} />
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(WorkTimeComponent);
