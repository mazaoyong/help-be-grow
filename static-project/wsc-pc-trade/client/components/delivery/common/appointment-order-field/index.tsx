import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import AppointmentOrder from './AppointmentOrder';
import './styles.scss';

const { Field } = Form;

export default class AppointmentOrderField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={AppointmentOrder} />;
  }
}
