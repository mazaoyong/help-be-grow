
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import InputStockField from './InputStockField';
const { Field } = Form;

export default class InputStockFieldWrap extends (PureComponent || Component) {
  render() {
    const { ...props } = this.props;
    return <Field component={InputStockField} validateOnChange={false} {...props} />;
  }
}
