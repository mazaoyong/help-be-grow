import React, { PureComponent } from 'react';
import { Radio } from 'zent';
import getControlGroup from 'components/form/get-control-group';

const RadioGroup = Radio.Group;

class FieldSwitch extends PureComponent {
  render() {
    const { value, data: confItem, disabled } = this.props;
    return (
      <div className="course-settings_radio-field">
        <RadioGroup
          value={value}
          disabled={disabled}
          onChange={e => this.props.onChange(+e.target.value)}
        >
          {confItem.radio.map(radioOption => {
            return (<Radio key={radioOption.value} value={+radioOption.value}>
              {radioOption.desc}
            </Radio>);
          })}
        </RadioGroup>
      </div>
    );
  }
}

export default getControlGroup(FieldSwitch);
