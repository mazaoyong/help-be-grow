import React, { Component } from 'react';
import { Input } from 'zent';
import { RegionSelect } from '@youzan/react-components';
import { get } from 'lodash';
import getControlGroup from 'components/form/get-control-group';

class AddressField extends Component {
  shouldComponentUpdate(nextProps) {
    if (!!nextProps.value.county_id || nextProps.value.detail !== this.props.value.detail) {
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
    return (
      <>
        <RegionSelect disabled={disabled} value={get(value.region, 'county_id')} onChange={this.handleRegionChange} />
        <Input placeholder="详细地址" disabled={disabled} value={value.detail || ''} onChange={this.handleDetailChange} />
      </>
    );
  }
}

export default getControlGroup(AddressField);
