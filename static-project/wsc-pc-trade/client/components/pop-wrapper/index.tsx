import React, { Children } from 'react';
import { Pop } from 'zent';

export default props => {
  return props.content ? <Pop {...props}>{props.children}</Pop> : Children.only(props.children);
};
