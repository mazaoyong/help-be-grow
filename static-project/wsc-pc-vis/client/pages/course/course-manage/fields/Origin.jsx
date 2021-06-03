
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormInputField } = Form;

export default class Origin extends Component {
  render() {
    const { label, origin } = this.props;
    return (
      <FormInputField
        name="origin"
        className="input-normal"
        label={label}
        value={origin}
        placeholder="请输入划线价"
        helpDesc="没有优惠的情况下，划线价在课程详情会以划线形式显示"
      />
    );
  }
}
