import React, { PureComponent } from 'react';
import { Checkbox } from 'zent';
import { Form } from '@zent/compat';

const prefix = 'custom-timing-arrive';

export interface IProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

class TimingArrive extends PureComponent<ZENT_FIELD_COMP<IProps>> {
  handleChange = evt => {
    this.props.onChange(evt.target.checked);
  };

  render() {
    const { value } = this.props;

    return (
      <div className={prefix}>
        <Checkbox className={`${prefix}__switch`} checked={value} onChange={this.handleChange}>
          开启定时达功能
        </Checkbox>
        <p className="help-desc">
          开启后，买家下单选择同城送时，需要选择送达时间，商家按约定时间送达。
        </p>
      </div>
    );
  }
}

// @ts-ignore
export default Form.getControlGroup(TimingArrive);
