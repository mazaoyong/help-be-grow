import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import Address, { IProps as ICompProps } from './Address';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class AddressField extends PureComponent<IProps> {
  render() {
    return (
      // @ts-ignore
      <Field
        {...this.props}
        component={Address}
        validations={{
          required: true,
          minLength: 5,
          maxLength: 120,
        }}
        validationErrors={{
          required: '具体地址不能为空',
          minLength: '具体地址最短5字',
          maxLength: '具体地址最长120字',
        }}
      />
    );
  }
}
