import React from 'react';
import './style.scss';

export default props => {
  return (
    <div className="list-has-no-data">
      <span className="list-has-no-data__text">{props.text}</span>
    </div>
  );
};
