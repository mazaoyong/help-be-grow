import { Pop } from '@zent/compat';
import React from 'react';
import { Icon } from 'zent';
import cx from 'classnames';
import './style/index.scss';

export default ({ className, style, type = 'help-circle', children }) => (
  <Pop trigger="hover" position="top-right" content={children} centerArrow>
    <Icon className={cx('deco-help-icon', className)} style={style} type={type} />
  </Pop>
);
