import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import IsStore, { IProps as ICompProps } from './IsStore';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class IsStoreField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={IsStore} />;
  }
}
