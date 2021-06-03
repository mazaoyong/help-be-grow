import React, { Component } from 'react';
import { Form } from '@zent/compat';
import BusinessHour, { IProps as ICompProps } from './BusinessHour';
import { validations } from './validate';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class BusinessHourField extends Component<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={BusinessHour} validations={validations} />;
  }
}
