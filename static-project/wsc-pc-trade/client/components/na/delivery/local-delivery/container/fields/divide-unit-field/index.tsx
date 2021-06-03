import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import DivideUnit from './DivideUnit';
import './styles.scss';

const { Field } = Form;

export default class DivideUnitField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={DivideUnit} />;
  }
}
