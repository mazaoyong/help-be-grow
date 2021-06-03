
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';
import './style.scss';

const { getControlGroup } = Form;
const RadioGroup = Radio.Group;

class ShowInStoreField extends Component {
  onChange = e => {
    this.props.onChange(e.target.value);
  };
  render() {
    const { value } = this.props;
    return (
      <RadioGroup className="show-in-store-field" onChange={this.onChange} value={value}>
        <Radio value={1}>显示</Radio>
        <p className="zent-form__help-desc">买家可以通过店铺或者链接访问。</p>
        <Radio value={0}>隐藏</Radio>
        <p className="zent-form__help-desc">买家仅能通过链接访问。</p>
      </RadioGroup>
    );
  }
}

export default getControlGroup(ShowInStoreField);
