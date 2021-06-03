import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import MaxReservation, { IProps as CompProps } from './MaxReservation';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<CompProps>;

export default class MaxReservationField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={MaxReservation} />;
  }
}
