import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import Reservation, { IProps as CompProps } from './Reservation';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<CompProps>;

export default class ReservationField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={Reservation} />;
  }
}
