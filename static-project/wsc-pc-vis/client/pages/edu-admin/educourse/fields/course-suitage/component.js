
import { Select, Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { NumberInput } from 'zent';
import assign from 'lodash/assign';
const { getControlGroup } = Form;

class SuitAgeRange extends (PureComponent || Component) {
  onItemClick = e => {
    this.props.onChange(assign({}, this.props.value, { applyType: e.target.value }));
  };

  onAgeChange = (e, name) => {
    if (name === 'minApply') {
      this.props.onChange(assign({}, this.props.value, { minApply: e }));
    } else {
      this.props.onChange(assign({}, this.props.value, { maxApply: e }));
    }
  };

  render() {
    const { dropdownData, value, disabled } = this.props;
    return (
      <div className="suitage-range-wrap">
        <NumberInput
          value={value.minApply}
          name="minApply"
          className='educourse-number'
          max={999}
          min={0}
          disabled={disabled}
          onChange={(e) => this.onAgeChange(e, 'minApply')}
          placeholder="最小"
        />
        <span>至</span>
        <NumberInput
          value={value.maxApply}
          name="maxApply"
          max={999}
          min={0}
          disabled={disabled}
          className='educourse-number'
          onChange={(e) => this.onAgeChange(e, 'maxApply')}
          placeholder="最大"
        />
        <Select
          data={dropdownData}
          width='70px'
          optionValue="id"
          optionText="text"
          value={value.applyType}
          disabled={disabled}
          className="suitage-dropdownbtn"
          popupClassName='suitage-dropdownbtn-popup'
          onChange={this.onItemClick}
        />
      </div>
    );
  }
}

export default getControlGroup(SuitAgeRange);
