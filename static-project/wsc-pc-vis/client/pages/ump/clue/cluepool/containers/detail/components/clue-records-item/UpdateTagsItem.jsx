import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Tag } from 'zent';
import ItemHeader from './ItemHeader';

// 更新标签
const UpdateTagsItem = ({ data }) => {
  const afterRef = useRef(null);
  const beforeRef = useRef(null);
  const [showAfterMore, setAfterShowMore] = useState(false);
  const [showBeforeMore, setBeforeShowMore] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const { operateInfo } = data;
  const { beforeTags, afterTags } = operateInfo;

  const wrapStyle = useMemo(() => {
    if (multiline) {
      return {
        height: 'auto',
        overflow: 'visible',
      };
    }
    return {
      height: '22px',
      overflow: 'hidden',
    };
  }, [multiline]);

  // 根据标签高度是否超过25判断标签是否为一行
  useLayoutEffect(() => {
    if (afterRef.current && afterRef.current.getBoundingClientRect().height > 25) {
      setAfterShowMore(true);
    }
    if (beforeRef.current && beforeRef.current.getBoundingClientRect().height > 25) {
      setBeforeShowMore(true);
    }
  }, []);

  return (
    <>
      <ItemHeader data={operateInfo} phase="更新标签" />
      <div className="item__body">
        <div className="item__body__tags__wrap" style={wrapStyle}>
          <span className="item__body__tags__label">新增标签：</span>
          <div className="item__body__tags__container">
            <div ref={afterRef} className={`item__body__tags__content ${(showAfterMore && !multiline) ? 'showmore' : ''}`}>
              {afterTags.length === 0 && '-'}
              {afterTags.map(({ id, name }) => {
                return <Tag key={id} theme="green" outline>{name}</Tag>;
              })}
            </div>
          </div>
        </div>
        <div className="item__body__tags__wrap" style={wrapStyle}>
          <span className="item__body__tags__label">删除标签：</span>
          <div className="item__body__tags__container">
            <div ref={beforeRef} className={`item__body__tags__content ${(showBeforeMore && !multiline) ? 'showmore' : ''}`}>
              {beforeTags.length === 0 && '-'}
              {beforeTags.map(({ id, name }) => {
                return <Tag key={id} theme="green" outline>{name}</Tag>;
              })}
            </div>
          </div>
        </div>
        {
          (showAfterMore || showBeforeMore) && !multiline && <span className="cursor-link item__body__expand" onClick={() => setMultiline(true)}>展开</span>
        }
      </div>
    </>
  );
};

export default UpdateTagsItem;
