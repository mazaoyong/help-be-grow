import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import Map, { IProps as ICompProps } from './Map';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class MapField extends PureComponent<IProps> {
  render() {
    return (
      // @ts-ignore
      <Field
        {...this.props}
        component={Map}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '请确认地理位置',
        }}
      />
    );
  }
}
