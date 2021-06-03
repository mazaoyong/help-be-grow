import React, { Component } from 'react';
import { Input } from 'zent';
import { Form } from '@zent/compat';
import { IPhone } from 'definitions/self-fetch';

export interface IProps {
  value: IPhone; // phone
  onChange: (phone: IPhone) => void;
}
/**
 * 联系电话字段组件
 */
class PhoneComponent extends Component<ZENT_FIELD_COMP<IProps>> {
  onAreaCodeChanged = e => {
    this.props.onChange({
      ...this.props.value,
      areaCode: e.target.value,
    });
  };
  onLocalNumberChanged = e => {
    this.props.onChange({
      ...this.props.value,
      localNumber: e.target.value,
    });
  };
  render() {
    return (
      <div className="phone-field">
        <Input
          className="area-code"
          inline
          width={80}
          maxLength={6}
          placeholder="区号"
          value={this.props.value.areaCode}
          onChange={this.onAreaCodeChanged}
        />
        &nbsp;&nbsp;{'-'}&nbsp;&nbsp;
        <Input
          className="local-number"
          inline
          width={380}
          maxLength={15}
          placeholder="填写准确的联系电话，便于买家联系（区号可留空）"
          value={this.props.value.localNumber}
          onChange={this.onLocalNumberChanged}
        />
      </div>
    );
  }
}
// @ts-ignore
export default Form.getControlGroup(PhoneComponent);
