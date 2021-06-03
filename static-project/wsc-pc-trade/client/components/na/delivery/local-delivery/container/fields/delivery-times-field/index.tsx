import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import DeliveryTimes from './DeliveryTimes';
import './styles.scss';

const { Field } = Form;

export default class DeliveryTimesField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={DeliveryTimes} />;
  }
}
