import React from 'react';
import { ISwitchProps, Switch } from 'zent';
import { EasyFormFieldProps } from '../types';

type EasyFormSwitchProps = Omit<ISwitchProps, 'checked'>;
export const EasyFormSwitch: React.FC<EasyFormFieldProps<EasyFormSwitchProps>> = (props) => {
  const { value, ...restProps } = props;

  return <Switch {...restProps} checked={value} />;
};
