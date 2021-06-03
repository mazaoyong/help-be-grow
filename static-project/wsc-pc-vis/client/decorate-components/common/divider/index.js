import React from 'react';

import './style/index.scss';

export default ({ color = '#ebedf0' }) => (
  <div className="decorate-divider" style={{ backgroundColor: color }} />
);
