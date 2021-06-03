import React from 'react';
import { BlockHeader } from 'zent';
import './index.scss';

const TextBlock = ({ title, items }) => {
  return (
    <div className="text-block">
      <BlockHeader title={title} />

      <ul className="requirements">
        {items.map(r => (
          <li className="requirement" key={r}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextBlock;
