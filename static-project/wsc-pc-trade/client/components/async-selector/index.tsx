import React, { FC } from 'react';
import EbizSelect, { SelectPropsTypes } from '@youzan/ebiz-select';
import { Form } from '@zent/compat';

import './style.scss';

interface IObjectLike<Value = any> {
  [key: string]: Value;
}

interface IAsyncSelectorFieldProps extends IObjectLike {
  name: string;
  label: string;
}

const { getControlGroup, Field } = Form;

const EbizSelectField = getControlGroup(EbizSelect);

const AsyncSelectorField: FC<IAsyncSelectorFieldProps & SelectPropsTypes> = props => (
  <div className="zent-custom-select">
    <Field {...props} component={EbizSelectField} />
  </div>
);

export default AsyncSelectorField;
