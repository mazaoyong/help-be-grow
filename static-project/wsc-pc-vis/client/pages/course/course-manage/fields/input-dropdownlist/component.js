import { Select } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { NumberInput } from 'zent';
import getControlGroup from '../ControlGroup';
import './index.scss';
const { Option } = Select;

class DropdownList extends (PureComponent || Component) {
  onItemClick = e => {
    const itemIndex = parseInt(e.target.value);
    this.props.onChange({
      range: this.props.value.range,
      unit: itemIndex,
    });
  };

  onInputChange = e => {
    this.props.onChange({
      range: e,
      unit: this.props.value.unit,
    });
  };

  render() {
    const { dropdownData, className, value, min, max, disabled } = this.props;
    return (
      <div className={className}>
        <NumberInput
          value={value.range}
          className="dropdown-left-input"
          min={min}
          max={max}
          disabled={disabled}
          onChange={this.onInputChange}
        />
        <Select className="dropdown-right-list"
          autoWidth
          popupClassName='dropdown-right-list-popup'
          disabled={disabled}
          value={value.unit}
          onChange={this.onItemClick}>
          { dropdownData.map((item, itemIndex) => (
            <Option key={itemIndex + 1} value={itemIndex + 1}> {item}</Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default getControlGroup(DropdownList);
