import { Pop } from '@zent/compat';
import React, { Children } from 'react';

export default props => {
  return props.content ? <Pop {...props}>{props.children}</Pop> : Children.only(props.children);
};
