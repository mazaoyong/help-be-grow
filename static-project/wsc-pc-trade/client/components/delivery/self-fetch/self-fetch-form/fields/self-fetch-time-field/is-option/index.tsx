import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import IsOptionComponent, { IProps as ICompProps } from './IsOption';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class IsOptionField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={IsOptionComponent} />;
  }
}
