import React from 'react';
import { ISwitchProps } from 'zent';
import { EasyFormFieldProps } from '../types';
declare type EasyFormSwitchProps = Omit<ISwitchProps, 'checked'>;
export declare const EasyFormSwitch: React.FC<EasyFormFieldProps<EasyFormSwitchProps>>;
export {};
