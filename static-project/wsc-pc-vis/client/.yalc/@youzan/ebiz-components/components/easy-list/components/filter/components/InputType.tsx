import React from 'react';
import { Input, IInputCoreProps } from 'zent';

import { IInputControlType } from '../../../types/filter';

type InputChangeHandler = Required<IInputCoreProps>['onChange'];
const FilterInput: React.FC<IInputControlType> = (props) => {
  const { value, onChange, ...passiveProps } = props;

  const handleChange = React.useCallback<InputChangeHandler>(
    (evt) => {
      const value = evt.target.value;
      onChange && onChange(value);
    },
    [onChange]
  );

  return <Input {...passiveProps} value={value} type="text" onChange={handleChange} />;
};

export default FilterInput;
