import React, { PureComponent } from 'react';
import { Radio } from 'zent';
import getControlGroup from 'components/form/get-control-group';

const RadioGroup = Radio.Group;

class FieldAudition extends PureComponent {
  handleChange = (value) => {
    this.props.onChange(Object.assign({}, this.props.value, value));
  }

  render() {
    const { value } = this.props;
    return (
      <div className="edu-settings_radio-field">
        <RadioGroup
          value={value}
          onChange={e => this.handleChange({ value: e.target.value })}
        >
          <Radio value={0}>
            不占用上课名额
          </Radio>
          <Radio value={1}>
            占用上课名额
          </Radio>
        </RadioGroup>
        <p className="zent-form__help-desc">
          {!value ? '将学员安排到某节课试听，不受当前日程的名额限制' : '日程里有剩余的名额，才允许将试听学员安排进去'}
        </p>
      </div>
    );
  }
}

export default getControlGroup(FieldAudition);
