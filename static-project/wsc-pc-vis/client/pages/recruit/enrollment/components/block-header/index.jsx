import React from 'react';

import './styles.scss';

export default function BlockHeader({ children }) {
  return (
    <div className="new-title">{children}</div>
  );
}
