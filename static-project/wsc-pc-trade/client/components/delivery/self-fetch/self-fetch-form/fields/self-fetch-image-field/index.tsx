import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import SelfFetchImage, { IProps as ICompProps } from './SelfFetchImage';
import './styles.scss';

const { Field } = Form;

type IProps = ZENT_FIELD<ICompProps>;

export default class SelfFetchImageField extends PureComponent<IProps> {
  render() {
    return (
      // @ts-ignore
      <Field
        {...this.props}
        component={SelfFetchImage}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '至少一张自提点照片',
        }}
      />
    );
  }
}
