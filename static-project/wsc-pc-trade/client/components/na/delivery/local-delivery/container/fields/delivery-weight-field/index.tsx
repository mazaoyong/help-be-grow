import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import DeliveryWeight from './DeliveryWeight';
import './styles.scss';

const { Field } = Form;

export default class DeliveryWeightField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={DeliveryWeight} />;
  }
}
