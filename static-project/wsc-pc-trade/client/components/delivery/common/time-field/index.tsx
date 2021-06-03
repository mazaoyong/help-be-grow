import React, { Component } from 'react';
import { Form } from '@zent/compat';
import Time, { IProps as ICompProps } from './Time';
import { validations } from './validate';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class TimeField extends Component<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={Time} validations={validations} />;
  }
}
