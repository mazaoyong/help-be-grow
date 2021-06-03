
import { Form } from '@zent/compat';
import React from 'react';

const { getControlGroup } = Form;

export default getControlGroup(props => {
  return <span style={{ lineHeight: '30px' }}>{props.value}</span>;
});
