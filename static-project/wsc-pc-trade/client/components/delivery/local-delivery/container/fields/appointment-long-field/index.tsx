import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import AppointmentLong from './AppointmentLong';
import './styles.scss';

const { Field } = Form;

export default class AppointmentLongField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={AppointmentLong} />;
  }
}
