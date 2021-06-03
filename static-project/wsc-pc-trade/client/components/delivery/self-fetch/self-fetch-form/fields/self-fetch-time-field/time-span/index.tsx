import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import TimeSpanComponent, { IProps as ICompProps } from './TimeSpan';
import { validations } from './validate';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class TimeSpanField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={TimeSpanComponent} validations={validations} />;
  }
}
