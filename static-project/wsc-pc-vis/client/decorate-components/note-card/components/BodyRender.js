import React from 'react';
import multiEllipsis from './multi-ellipsis';

export const imageBodyRender = data => {
  return (
    <div className="modal__img-wrapper">
      <img alt="" src={data.image_url || data.cover_attachment_url} />
      <a href={data.url} target="_blank" rel="noopener noreferrer">
        {multiEllipsis(data.title)}
      </a>
    </div>
  );
};

export const titleBodyRender = data => (
  <a href={data.url} target="_blank" rel="noopener noreferrer">
    {data.title}
  </a>
);

export const createTimeBodyRender = data => <div>{data.created_time}</div>;
