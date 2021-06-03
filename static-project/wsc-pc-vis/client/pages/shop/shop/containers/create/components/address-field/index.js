
import { Form as ZentForm } from '@zent/compat';
/**
 * 店铺详细地址组件
 */
import React from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = ZentForm;

const AddressField = getControlGroup(props => {
  const passableProps = omit(props, unknownProps);

  const addressOnChange = evt => {
    props.onChange(evt.target.value);
  };

  return (
    <div>
      <Input {...passableProps} value={props.value} onChange={addressOnChange} />
    </div>
  );
});

export default AddressField;
