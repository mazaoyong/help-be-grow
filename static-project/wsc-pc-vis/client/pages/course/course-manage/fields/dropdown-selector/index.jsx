
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import DropdownSelector from './component';
import './index.scss';

const { Field } = Form;

class DropdownSelectorWrap extends (Component || PureComponent) {
  render() {
    const { name, ...props } = this.props;
    return <Field name={name} component={DropdownSelector} {...props} />;
  }
}

export default DropdownSelectorWrap;
