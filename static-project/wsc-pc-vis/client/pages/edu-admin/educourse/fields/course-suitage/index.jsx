
import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import component from './component';
import './index.scss';
const { Field } = Form;

export default class CourseSuitAge extends (PureComponent || Component) {
  render() {
    const { value, ...props } = this.props;
    return <Field component={component} dropdownData={[{ id: 0, text: '月龄' }, { id: 1, text: '岁' }]} {...props} value={value} />;
  }
}
