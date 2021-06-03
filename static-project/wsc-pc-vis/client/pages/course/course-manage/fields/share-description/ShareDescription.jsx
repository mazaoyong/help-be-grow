
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormInputField } = Form;

export default class ShareDescriptionWrap extends Component {
  render() {
    return (
      <FormInputField
        name="subTitle"
        className="form-input-large"
        label={this.props.label}
        maxLength="36"
        autoComplete="off"
        placeholder="请输入分享描述"
        helpDesc="微信分享给好友时也会显示此文案，建议36字以内"
        value={this.props.subTitle}
      />
    );
  }
}
