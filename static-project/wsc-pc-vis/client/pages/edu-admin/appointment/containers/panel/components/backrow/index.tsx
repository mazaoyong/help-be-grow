import React, { FC } from 'react';
// import { hashHistory } from 'react-router';
import { MouseFollow } from '@youzan/ebiz-components';
import './style.scss';

export interface IBackRowProps {
  date: Date;
  callback: () => {};
}

const BackRow: FC<IBackRowProps> = ({ callback }) => {
  return (
    <MouseFollow
      popContent={<div className="schedule__backrow__pop">点击新建预约</div>}
      position="TopRight"
      cushion={{ top: -5 }}
    >
      <div
        className="schedule__backrow__content"
        onClick={callback}
      />
    </MouseFollow>
  );
};

export default BackRow;
