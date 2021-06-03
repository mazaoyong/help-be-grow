import React from 'react';

import { Form, FormError, FormControl } from 'zent';
import { Select } from '@zent/compat';

export default function FormSelectField({
  name,
  model,
  defaultValue = '',
  validators = [],
  label,
  required,
  withoutLabel,
  style,
  className,
  props: selectProps,
}) {
  if (name && model) {
    throw new Error('Cannot use name and model together.');
  }
  const filed = Form.useField(name || model, defaultValue, [...validators]);

  const onChange = React.useCallback(
    (_, item) => {
      filed.isTouched = true;
      filed.patchValue(item.value);
    },
    [filed],
  );

  return (
    <FormControl
      style={style}
      className={className}
      label={label}
      required={required}
      withoutLabel={withoutLabel}
    >
      <Select value={filed.value} onChange={onChange} {...selectProps}></Select>
      <FormError>{filed.error?.message}</FormError>
    </FormControl>
  );
}
