import React from 'react';
import cx from 'classnames';
import './style/index.scss';

const prefix = 'deco-help-desc';

export default ({ className, type = 'tips', inline, ...restProps }) => (
  <div
    className={cx(prefix, className, `${prefix}--${type}`, {
      [`${prefix}--inline`]: inline,
    })}
    {...restProps}
  />
);
