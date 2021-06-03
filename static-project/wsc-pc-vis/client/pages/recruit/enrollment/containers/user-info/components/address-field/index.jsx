import React, { Component } from 'react';
import { Input } from 'zent';
import { RegionSelect } from '@youzan/react-components';
import getControlGroup from 'components/form/get-control-group';

class AddressField extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.value.region || (nextProps.value.detail !== this.props.value.detail)
    ) {
      return true;
    }
    return false;
  }

  handleRegionChange = region => {
    if (region.county_id) {
      this.props.onChange({ ...this.props.value, region });
    }
  };

  handleDetailChange = e => {
    this.props.onChange({ ...this.props.value, detail: e.target.value });
  }

  render() {
    const { value, disabled } = this.props;
    const countyId = (value.region && value.region.county_id) || '000000';
    return (
      <>
        <RegionSelect disabled={disabled} value={countyId} onChange={this.handleRegionChange} />
        <Input
          autoComplete="off"
          type="textarea"
          disabled={disabled}
          value={value.detail || ''}
          onChange={this.handleDetailChange}
          showCount
          width="260px"
          maxLength={100}
          placeholder="详细地址"
        />
      </>
    );
  }
}

export default getControlGroup(AddressField);
