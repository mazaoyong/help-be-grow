
import { Select, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio } from 'zent';

import { findListAllCampus } from '../../api/list';

const RadioGroup = Radio.Group;
const { getControlGroup } = Form;

class ChainAssignField extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    findListAllCampus().then(data => {
      const options = data.map(item => ({
        text: item.shopName,
        value: item.kdtId,
      }));
      this.setState({ options });
    });
  }

  handleKdtTypeSelect = e => {
    this.handleChange({ kdtType: e.target.value });
  };

  handleKdtIdSelect = (e, selected) => {
    this.handleChange({
      targetKdtId: selected.value,
    });
  };

  handleChange = data => {
    this.props.onChange(Object.assign({}, this.props.value, data));
  }

  render() {
    const { options } = this.state;
    const { kdtType, targetKdtId } = this.props.value || {};
    return (
      <div>
        <RadioGroup onChange={this.handleKdtTypeSelect} value={kdtType}>
          <Radio className="singleline radio" value={1}>分配给总部</Radio>
          <Radio className="singleline radio radio-with-select" value={2}>
            分配给
            <Select className="selector" data={options} value={targetKdtId} onChange={this.handleKdtIdSelect} />
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}

export default getControlGroup(ChainAssignField);
