import React, { Component } from 'react';
import { Input, Button } from 'zent';
import { Form } from '@zent/compat';

export interface IProps {
  value: string; // address
  handleAddressChanged: (address: string) => void;
  handleSearch: (query: string) => void;
}
/**
 * 具体地址字段组件
 */
class AddressComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  state = {
    query: '',
  };
  onAddressChanged = e => {
    this.props.handleAddressChanged(e.target.value);
    this.props.onBlur(e.target.value);
  };
  onSearch = () => {
    this.props.handleSearch(this.props.value);
  };
  render() {
    return (
      <div className="address-field">
        <Input
          className="address-input"
          width={380}
          placeholder="请填写自提点的具体地址，最短5字，最长120字。"
          value={this.props.value}
          onChange={this.onAddressChanged}
        />
        <Button onClick={this.onSearch}>搜索地图</Button>
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(AddressComponent);
