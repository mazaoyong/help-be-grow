
import { Form } from '@zent/compat';
import React, { FC } from 'react';
import component from './component';
import { IMediaFieldParam } from './interface';
import './index.scss';
const { Field } = Form;

const MediaField: FC<IMediaFieldParam> = (props) => {
  // const { extraContents = [] } = props;
  return <Field
    className= 'media-field-wrap'
    name="extraContents"
    component={component}
    {...props}
  />;
};

export default MediaField;
