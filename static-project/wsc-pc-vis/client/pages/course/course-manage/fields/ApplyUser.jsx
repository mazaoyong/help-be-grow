
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormInputField } = Form;

export default class ApplyUser extends Component {
  render() {
    const { label, applyUser } = this.props;
    return (
      <FormInputField
        name="applyUser"
        className="form-input-large"
        label={label}
        value={applyUser}
        type="textarea"
        autoSize
        maxLength="1000"
      />
    );
  }
}
