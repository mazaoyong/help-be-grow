import React, { PureComponent } from 'react';
import { Radio, NumberInput } from 'zent';
import getControlGroup from 'components/form/get-control-group';

const RadioGroup = Radio.Group;

class FieldLimit extends PureComponent {
  render() {
    const { inputWidth, value } = this.props;
    const { isAppointmentLimit, startAppointmentDay, stopAppointmentHour } = value;
    return (
      <div className="edu-settings_radio-field">
        <RadioGroup
          value={isAppointmentLimit}
          onChange={e => this.handleChange({ isAppointmentLimit: e.target.value })}
        >
          <Radio value={1}>限制</Radio>
          <Radio value={0}>不限制</Radio>
        </RadioGroup>
        <div style={{ display: isAppointmentLimit ? 'block' : 'none' }}>
          <div className="edu-settings-row edu-settings-row-justify">
            可提前
            <NumberInput
              className="appointment-limit"
              value={startAppointmentDay}
              onChange={value =>
                this.handleChange({ startAppointmentDay: Number(value) || 0 })
              }
              max={90}
              min={1}
              width={inputWidth}
            />
            天预约， 课程开始前
            <NumberInput
              className="appointment-limit"
              value={stopAppointmentHour}
              onChange={value =>
                this.handleChange({ stopAppointmentHour: Number(value) || 0 })
              }
              max={100}
              min={0}
              width={inputWidth}
            />
            小时停止预约
          </div>
        </div>
      </div>
    );
  }
  handleChange = value => {
    this.props.onChange(Object.assign({}, this.props.value, value));
  };
}

export default getControlGroup(FieldLimit);
