
import { Form, IFormControlGroupProps } from '@zent/compat';
import React, { FC } from 'react';
import { Radio, IRadioEvent } from 'zent';

import { ObjectLike } from '../index';
import '../styles/gender-type.scss';

const { getControlGroup } = Form;
const { Group } = Radio;

const GenderType: FC<IFormControlGroupProps & ObjectLike> = props => {
  const handleChange = (evt: IRadioEvent<string>) => {
    const { onChange } = props;
    if (onChange) {
      onChange(evt.target.value);
    }
  };

  return (
    <Group className="gender-type" onChange={handleChange} value={(props.value as number).toString()}>
      <Radio value="1">男</Radio>
      <Radio value="2">女</Radio>
    </Group>
  );
};

export default getControlGroup(GenderType as any);
