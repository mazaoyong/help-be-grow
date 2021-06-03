import React from 'react';
import { format } from 'date-fns';
import { isEduChainStore } from '@youzan/utils-shop';

// 卡片表头
const ItemHeader = ({ data, phase }) => {
  return (
    <header className="item__header">
      <p>
        <b className="name">{data.operatorName}</b>
        {(isEduChainStore && data.operatorSchoolName) && <span> ({data.operatorSchoolName})</span>}
        <span className="phone">{data.operatorTel}</span>
        <time className="time">{format(data.operateTime, 'YYYY-MM-DD HH:mm:ss')}</time>
      </p>
      <span className="item__header__phase">{phase}</span>
    </header>
  );
};

export default ItemHeader;
