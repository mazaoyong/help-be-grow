import React from 'react';
import cx from 'classnames';
import './style/index.scss';

export default ({ className, ...restProps }) => (
  <div className={cx('deco-footer', className)} {...restProps} />
);
