import React from 'react';
import getCondition from '../utils/get-condition';
import Item from '../item';
import './style.scss';

export default ({ data }) => {
  if (!getCondition(data, 'show')) return null;

  const className = 'application-list' + (data.order ? ` animation-order-${data.order}` : '');

  return (
    <div className={className}>
      <p className="application-title">
        <span>{data.title}</span>
        {data.desc && <span className="application-title-desc">{data.desc}</span>}
      </p>
      <ul className="application-body">
        {data.config.map((value, idx) => {
          return <Item key={idx} data={value} />;
        })}
      </ul>
    </div>
  );
};
