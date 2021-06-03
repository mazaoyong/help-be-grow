import React from 'react';
import { Pop, Icon, IPopProps } from 'zent';
import s from './style.m.scss';

export default (props: IPopProps) => {
  return (
    <Pop trigger="hover" position="top-left" centerArrow {...props}>
      <Icon type="help-circle" className={s.helpCircle} />
    </Pop>
  );
};
