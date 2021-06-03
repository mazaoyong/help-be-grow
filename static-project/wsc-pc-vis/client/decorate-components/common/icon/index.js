import React from 'react';
import './style/index.scss';
// import './style/_index.scss'; // dev

export default ({ type, className, ...restProps }) => {
  if (!type) {
    return null;
  }
  return <i className={`deco-icon-${type} ${className || ''}`} {...restProps} />;
};
