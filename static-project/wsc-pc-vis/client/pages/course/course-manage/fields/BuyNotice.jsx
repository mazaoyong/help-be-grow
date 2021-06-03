
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormInputField } = Form;

export default class BuyNotice extends Component {
  render() {
    const { label, buyNotice } = this.props;
    return (
      <FormInputField
        name="buyNotice"
        className="form-input-large"
        label={label}
        value={buyNotice}
        type="textarea"
        autoSize
        maxLength="1000"
        showCount
      />
    );
  }
}
