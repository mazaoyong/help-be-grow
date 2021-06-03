import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import TimeDivideComponent, { IProps as CompProps } from './TimeDivide';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<CompProps>;

export default class TimeDivideField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={TimeDivideComponent} />;
  }
}
