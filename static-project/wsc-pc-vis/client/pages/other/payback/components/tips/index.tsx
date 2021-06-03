import React from 'react';
import { Alert } from 'zent';

import './index.scss';

const Tips = ({ children }) => (
  <Alert type="warning" className="payback-tips">
    {children}
  </Alert>
);

export default Tips;
