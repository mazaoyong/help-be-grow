
import { Select, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio } from 'zent';

import { findPagePowerStaffs } from '../../api/list';

const RadioGroup = Radio.Group;
const { getControlGroup } = Form;

class AssignField extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    findPagePowerStaffs().then(data => {
      const options = data.map(item => ({
        text: item.name,
        value: item.adminId,
      })) || [];
      this.setState({ options });
    });
  }

  handleReceiveTypeChange = e => {
    this.handleChange({ receiveType: e.target.value });
  };

  handleUserIdSelect = (ev, selected) => {
    this.handleChange({
      userId: selected.value,
    });
  };

  handleChange = data => {
    this.props.onChange(Object.assign({}, this.props.value, data));
  }

  render() {
    const { options } = this.state;
    const { kdtType } = this.props;
    const { receiveType, userId } = this.props.value || {};
    return (
      <div>
        <RadioGroup onChange={this.handleReceiveTypeChange} value={receiveType}>
          <Radio className="singleline radio" value={0}>{kdtType === 1 ? '分配到总部公海池' : '分配到公海池' }</Radio>
          <Radio className="singleline radio radio-with-select" value={1}>
            {kdtType === 1 ? '分配给总部员工' : '分配给员工' }
            <Select
              className="selector"
              data={options}
              value={userId}
              onChange={this.handleUserIdSelect}
              filter={(item, keyword) => item.text.indexOf(keyword) > -1}
            />
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}

export default getControlGroup(AssignField);
