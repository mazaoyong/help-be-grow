import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import WorkTime, { IProps as ICompProps } from './WorkTime';
import { validations } from './validate';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class WorkTimeField extends PureComponent<IProps> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={WorkTime} validations={validations} />;
  }
}
