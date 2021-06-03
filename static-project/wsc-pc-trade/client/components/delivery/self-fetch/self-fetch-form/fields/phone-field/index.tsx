import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import Phone, { IProps as ICompProps } from './Phone';
import { validations } from './validate';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class PhoneField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={Phone} validations={validations} />;
  }
}
