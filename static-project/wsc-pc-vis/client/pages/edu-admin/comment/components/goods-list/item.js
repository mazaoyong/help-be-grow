/* eslint-disable camelcase */
import React from 'react';
import cx from 'classnames';
import { Tag } from 'zent';
import { format } from 'date-fns';

const Item = props => {
  const { title, columnName, publishAt, totalCommentCount, newCommentCount } = props.data;
  const time = format(publishAt, 'YYYY-MM-DD HH:mm:ss');
  const styleClass = cx({
    'paid-content-list__item-wrap': true,
    'paid-content-list__item-wrap--active': props.active,
  });

  const getMediaType = (() => {
    const { mediaType } = props.data;
    switch (mediaType) {
      case 1:
        return '图文';
      case 2:
        return '音频';
      case 3:
        return '视频';
      case 4:
        return '直播';
      default:
        return null;
    }
  })();

  return (
    <div className={styleClass}>
      <div className="paid-content-list__item" onClick={props.onClick}>
        <div className="paid-content-list__item__title">
          {getMediaType && (
            <Tag theme="blue" outline>
              {getMediaType}
            </Tag>
          )}
          {title}
        </div>
        <div className="paid-content-list__item__desc">
          {columnName ? `专栏：${columnName}` : ''}
        </div>
        <div className="paid-content-list__item__other clearfix">
          <span className="paid-content-list__item__time">{time}</span>
          <span className="paid-content-list__item__count">
            {totalCommentCount}条
            {newCommentCount > 0 ? (
              <span className="paid-content-list__item__bubble">
                {newCommentCount > 99 ? 99 : newCommentCount}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Item;
