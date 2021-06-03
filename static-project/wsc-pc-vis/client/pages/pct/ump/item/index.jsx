import { Pop } from '@zent/compat';
import React, { isValidElement, cloneElement } from 'react';

import get from 'lodash/get';
import Icon from './Icon';
import './style.scss';
const { imgqn } = window._global.url;

export default ({ data }) => {
  if (get(data, 'hide') === true) return null;

  const plugins = get(data, 'plugins') ? data.plugins : null;

  const desc = typeof data.desc === 'function' ? data.desc() : data.desc;

  const url = typeof data.url === 'function' ? data.url() : data.url;
  const entryUrl = data.disable ? 'javascript:void(0);' : url;

  const icon = `${imgqn}${data.icon}`;

  const srcSet = data.srcset ? `${imgqn}${data.srcset} 2x` : '';

  const className = `application-item${data.recommend ? ' recommend' : ''}`;

  const backgroundColor = data.color || 'red';

  const itemContent = (
    <a href={entryUrl} className="application-entry">
      <div className={`application-logo ${backgroundColor}-bg`}>
        <img src={icon} srcSet={srcSet} />
      </div>
      <div className="application-name">
        {data.name}
        {plugins &&
          plugins.map((p, index) => (isValidElement(p) ? cloneElement(p, { key: index }) : null))}
        <Icon data={data} />
        {data.tip ? <span className="application-tips">{data.tip}</span> : null}
      </div>
      <div className="application-desc">{desc}</div>
    </a>
  );

  return (
    <li className={className}>
      {data.disable && data.disableTip ? (
        <Pop
          wrapperClassName="pop-disable-tip"
          trigger="hover"
          position="top-center"
          content={data.disableTip}
        >
          {itemContent}
        </Pop>
      ) : (
        itemContent
      )}
    </li>
  );
};
