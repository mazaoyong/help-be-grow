import React, { FC } from 'react';
import { MouseFollow } from '@youzan/ebiz-components';
import { IViewCellData } from '../../types';
import MonthCell from '../month-cell';
import { format } from 'date-fns';
import travel from '@youzan/utils/date/travel';
import './index.scss';

export interface IMonthRenderProps {
  date: Date;
  data: IViewCellData[];
  onMonthClick: (date: string) => void;
}

const MonthRender: FC<IMonthRenderProps> = ({ date, data, onMonthClick }) => {
  const isBeforeForbid = new Date(date) < travel(-90, new Date(), 'day'); // 无法创建90天之前的日程

  return <MouseFollow
    popContent={<div className="schedule__month__pop">{isBeforeForbid ? '不允许操作90天以前的日程' : '点击新建日程'}</div>}
    position="TopRight"
    cushion={{ top: -5 }}
  > <div onClick={isBeforeForbid ? () => {} : () => onMonthClick(format(date, 'YYYY-MM-DD'))} className="schedule__month">
      <div className={`schedule__month__header ${format(date, 'YYYY-MM-DD') === format(new Date(), 'YYYY-MM-DD') ? 'current' : ''}`}>{new Date(date).getDate()}</div>
      <div className="schedule__month__body">
        <MonthCell date={date} data={data} />
      </div>
    </div>
  </MouseFollow>;
};

export default MonthRender;
