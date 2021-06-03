import React, { PureComponent } from 'react';
import { Radio, NumberInput } from 'zent';
import getControlGroup from 'components/form/get-control-group';

const RadioGroup = Radio.Group;

class FieldSignIn extends PureComponent {
  render() {
    const { signInRule, startSignInRuleHour, stopSignInRuleHour } = this.props.value;
    return (
      <div className="edu-settings_radio-field">
        <RadioGroup
          value={signInRule}
          onChange={e => this.handleChange({ signInRule: e.target.value })}
        >
          <Radio value={1}>限制</Radio>
          <Radio value={0}>不限制</Radio>
        </RadioGroup>
        <div style={{ display: signInRule ? 'block' : 'none' }}>
          <div className="edu-settings-row edu-settings-row-justify">
            课程开始前
            <NumberInput
              value={startSignInRuleHour}
              max={1000}
              min={0}
              onChange={value =>
                this.handleChange({ startSignInRuleHour: Number(value) || 0 })
              }
            />
            小时可以签到， 课程结束后
            <NumberInput
              value={stopSignInRuleHour}
              max={1000}
              min={0}
              onChange={value => this.handleChange({ stopSignInRuleHour: Number(value) || 0 })}
            />
            小时停止签到
          </div>
        </div>
      </div>
    );
  }
  handleChange = value => {
    this.props.onChange(Object.assign({}, this.props.value, value));
  };
}

export default getControlGroup(FieldSignIn);
