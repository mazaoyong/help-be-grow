import React, { PureComponent } from 'react';
import { Checkbox } from 'zent';
import getControlGroup from 'components/form/get-control-group';

class FieldWriteOff extends PureComponent {
  render() {
    const { writeOffRuleLeave, writeOffRuleTruancy } = this.props.value;
    return (
      <div className="edu-settings_radio-field">
        <Checkbox
          checked={writeOffRuleLeave}
          onChange={e => this.handleChange({ writeOffRuleLeave: e.target.checked ? 1 : 0 })}
        >
          请假算消课
        </Checkbox>
        <Checkbox
          checked={writeOffRuleTruancy}
          onChange={e => this.handleChange({ writeOffRuleTruancy: e.target.checked ? 1 : 0 })}
        >
          未到算消课
        </Checkbox>
        {/* <RadioGroup
          value={writeOffRule}
          onChange={e => this.handleChange({ writeOffRule: e.target.value })}
        >
          <Radio value={1}>按签到消课</Radio>
          <Radio value={0}>课节开课后自动消课</Radio>
        </RadioGroup>
        <div style={{ display: writeOffRule ? 'block' : 'none' }}>
        </div> */}
      </div>
    );
  }
  handleChange = value => {
    this.props.onChange(Object.assign({}, this.props.value, value));
  };
}

export default getControlGroup(FieldWriteOff);
