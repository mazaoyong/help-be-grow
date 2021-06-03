
import React, { FC, useCallback } from 'react';
import { Radio, IRadioEvent } from 'zent';

import '../styles/gender-type.scss';
import { IProfileField } from '../types';
const { Group } = Radio;

const GenderType: FC<IProfileField & Record<string, any>> = props => {
  const { onChange, value } = props;
  const handleChange = useCallback((evt: IRadioEvent<string>) => {
    onChange && onChange(evt.target.value);
  }, [onChange]);

  return (
    <Group className="gender-type" onChange={handleChange} value={String(value)}>
      <Radio value="1">男</Radio>
      <Radio value="2">女</Radio>
    </Group>
  );
};

export default GenderType;
