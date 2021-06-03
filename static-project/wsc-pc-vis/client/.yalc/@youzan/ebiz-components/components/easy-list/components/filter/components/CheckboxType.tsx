import React from 'react';
import { Checkbox, ICheckboxGroupProps } from 'zent';
import { ICheckboxControlType } from '../../../types/filter';

type CheckboxGroupChangeHandler = Required<ICheckboxGroupProps<string[]>>['onChange'];
const CheckboxGroup = Checkbox.Group;

const CheckboxType: React.FC<ICheckboxControlType> = (props) => {
  const { value, onChange, options, ...passiveProps } = props;

  const handleChange = React.useCallback<CheckboxGroupChangeHandler>(
    (values) => {
      onChange && onChange(values);
    },
    [onChange]
  );

  /* istanbul ignore next */
  if (!options || !options.length) {
    return null;
  }
  return (
    <CheckboxGroup {...passiveProps} value={value} onChange={handleChange}>
      {options.map((opt) => (
        <Checkbox key={opt.value} value={opt.value} disabled={opt.disabled || false}>
          {opt.text}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default CheckboxType;
