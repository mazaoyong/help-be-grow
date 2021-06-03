import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import StoreAddr from './StoreAddr';
import './styles.scss';

const { Field } = Form;

export default class StoreAddrField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={StoreAddr} />;
  }
}
