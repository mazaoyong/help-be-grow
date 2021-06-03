
import { Form, IFormControlGroupProps } from '@zent/compat';
import React, { Component } from 'react';

import { Notify } from 'zent';

const { createForm } = Form;

const formPropsArr = [
  'className',
  'prefix',
  'vertical',
  'horizontal',
  'inline',
  'style',
  'disableEnterSubmit',
];

export interface ICustomizedFormProps extends IFormControlGroupProps {
  onSubmit(args: any): void;
}

class CustomizedForm extends Component<ICustomizedFormProps, {}> {
  get formProps() {
    const formProps = {};
    Object.keys(this.props).forEach(p => {
      if (formPropsArr.includes(p)) {
        formProps[p] = this.props[p];
      }
    });

    return formProps;
  }

  onSubmit = values => {
    const { zentForm, onSubmit } = this.props;
    zentForm.asyncValidateForm(
      () => {
        onSubmit(values);
      },
      () => {
        Notify.error('表单校验失败!');
      },
    );
  };

  render() {
    const { handleSubmit, children } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} {...this.formProps}>
        {children}
      </Form>
    );
  }
}

export default createForm({ scrollToError: true } as any)(CustomizedForm as any) as any;
