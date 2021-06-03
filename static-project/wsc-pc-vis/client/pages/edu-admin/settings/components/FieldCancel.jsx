import React, { PureComponent } from 'react';
import { Radio, NumberInput } from 'zent';
import getControlGroup from 'components/form/get-control-group';

const RadioGroup = Radio.Group;

class FieldCancel extends PureComponent {
  render() {
    const { inputWidth, value } = this.props;
    const { isCancelAppointment = 0, canCancelAppointmentHour = 1 } = value;
    return (
      <div className="edu-settings_radio-field">
        <RadioGroup
          value={isCancelAppointment}
          onChange={e => this.handleChange({ isCancelAppointment: e.target.value })}
        >
          <Radio value={1}>允许取消</Radio>
          <Radio value={0}>不允许取消</Radio>
        </RadioGroup>
        <div className="edu-settings-row edu-settings-row-justify" style={{ display: isCancelAppointment ? 'block' : 'none' }}>
          上课前
          <NumberInput
            className="appointment-limit"
            value={canCancelAppointmentHour}
            onChange={value =>
              this.handleChange({ canCancelAppointmentHour: Number(value) || 0 })
            }
            min={0}
            max={1000}
            width={inputWidth}
          />
          小时可取消
        </div>
      </div>
    );
  }
  handleChange = value => {
    this.props.onChange(Object.assign({}, this.props.value, value));
  };
}

export default getControlGroup(FieldCancel);
