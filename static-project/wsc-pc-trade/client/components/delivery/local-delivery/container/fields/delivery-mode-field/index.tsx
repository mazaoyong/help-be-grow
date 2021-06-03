import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import DeliveryMode from './DeliveryMode';
import './styles.scss';

const { Field } = Form;

export default class DeliveryModeField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={DeliveryMode} />;
  }
}
