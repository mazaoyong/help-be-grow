import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import Region, { IProps as ICompProps } from './Region';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class RegionField extends PureComponent<IProps> {
  render() {
    return (
      // @ts-ignore
      <Field
        {...this.props}
        component={Region}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '地址未选择',
        }}
      />
    );
  }
}
