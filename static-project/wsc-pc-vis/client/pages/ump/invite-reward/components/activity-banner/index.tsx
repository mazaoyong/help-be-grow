import React, { FC } from 'react';
import { Tag } from 'zent';
import { date } from '@youzan/utils';
import { ActivityStatus } from '../../types';

import './style.scss';

export interface ActivityBannerData {
  name: string;
  startAt: number;
  endAt: number;
  status: number;
}

interface ActivityBannerProps {
  activity: ActivityBannerData;
}

const statusClassMap = {
  [ActivityStatus.notStarted]: 'not-started',
  [ActivityStatus.ongoing]: 'ongoing',
  [ActivityStatus.ended]: 'ended',
  [ActivityStatus.invalid]: 'invalid',
};

export const ActivityBanner: FC<ActivityBannerProps> = ({ activity }) => {
  const {
    name, startAt, endAt, status,
  } = activity;
  return (
    <div className="activity-detail-banner">
      <div className="activity-title">
        {name}
        <Tag theme="grey" className={statusClassMap[status]} outline />
      </div>
      <p className="activity-time">
        活动时间：
        {date.makeDateTimeStr(startAt)}
        {' 至 '}
        {date.makeDateTimeStr(endAt)}
      </p>
    </div>
  );
};
