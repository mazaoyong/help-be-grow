import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import DeliveryImg from './DeliveryImg';
import './styles.scss';

const { Field } = Form;

export default class DeliveryImgField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={DeliveryImg} />;
  }
}
