import React, { FC } from 'react';
import cx from 'classnames';
import { IStatsTitleProps } from '../../types';

import './styles.scss';

const StatusParser: FC<{ status: string }> = ({ status }) => (
  <div className="event-status">
    活动状态：<span className={cx({ ongoing: status === '进行中' })}>{status}</span>
  </div>
);

const TimespanParser: FC<{ startTime?: string, endTime?: string }> = ({ startTime, endTime }) => (
  <div className="event-timespan">
    活动时间：{(!startTime || !endTime) ? '加载中...' : `${startTime} 至 ${endTime}`}
  </div>
);

const StatsTitle: FC<IStatsTitleProps | null> = (props) => {
  const { title = '加载中...', status = '加载中...', startTime, endTime } = props;

  return (
    <div className="stats-title">
      <h1>{title}</h1>
      <div className="event-attributes">
        <StatusParser status={status as string} />
        <TimespanParser startTime={startTime} endTime={endTime} />
      </div>
    </div>
  );
};

export default StatsTitle;
