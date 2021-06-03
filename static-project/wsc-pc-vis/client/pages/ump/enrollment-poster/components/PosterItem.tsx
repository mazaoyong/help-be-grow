import React from 'react';
import PosterItemAction from './PosterItemAction';
import { IPosterItemData } from '../types';
import { RELATED_TYPE } from '../contants';
import { fullfillImage } from '@youzan/utils';

interface IPosterItemProps {
  data: IPosterItemData;
}
function PosterItem(props: IPosterItemProps) {
  const { id, templatePicUrl, applyNum, pv, title, relevantContextType } = props.data;
  let regisNum = typeof applyNum === 'number' ? applyNum : '-';
  if (
    relevantContextType === RELATED_TYPE.FIXEDQRCODE ||
    relevantContextType === RELATED_TYPE.LIVECODE
  ) {
    regisNum = '-';
  }
  return (
    <div className="poster-item">
      <div className="poster-item-img">
        <img src={fullfillImage(templatePicUrl, '!304x480.jpg')} />
      </div>
      <div className="poster-item-desc">
        <div className="poster-item-title">{title}</div>
        <div className="poster-item-info">
          <div className="poster-item-info-line">{regisNum}人报名</div>
          <div className="poster-item-info-line">{typeof pv === 'number' ? pv : '-'}人访问</div>
        </div>
        <PosterItemAction id={id} data={props.data} />
      </div>
    </div>
  );
}

export default PosterItem;
