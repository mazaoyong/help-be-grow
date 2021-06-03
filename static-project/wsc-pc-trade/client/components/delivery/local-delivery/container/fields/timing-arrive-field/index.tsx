import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import TimingArrive from './TimingArrive';
import './styles.scss';

const { Field } = Form;

export default class TimingArriveField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={TimingArrive} />;
  }
}
