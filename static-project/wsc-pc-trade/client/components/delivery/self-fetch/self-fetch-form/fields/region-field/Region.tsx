import React, { Component } from 'react';
import { Form } from '@zent/compat';
import { RegionSelect } from '@youzan/react-components';

export interface IProps {
  value: string; // county_id
  handleRegionChanged: (v: any) => void;
}
/**
 * 自提点地址字段组件
 */
class RegionComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.value === this.props.value) {
      return false;
    }
    return true;
  }
  render() {
    return (
      <RegionSelect
        className="self-fetch-region-select"
        value={this.props.value}
        onChange={this.props.handleRegionChanged}
      />
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(RegionComponent);
