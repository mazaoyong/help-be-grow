
import { Form } from '@zent/compat';
import React from 'react';
import component from './component';

const { Field } = Form;

export default props => {
  return (
    <Field
      name="title"
      label={props.label}
      required
      value={props.title}
      validations={{
        required: true,
        maxLength: 40,
      }}
      validationErrors={{
        required: '线下课名称必须填写，最多40个字',
        maxLength: '线下课名称必须填写，最多40个字',
      }}
      component={component}
    />
  );
};
