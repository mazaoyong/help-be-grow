import React, { FC, useState, useEffect } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { format } from 'date-fns';
import { IVisRouterProps } from 'fns/router';
import StatsTitle from './blocks/stats-title';
import Summary from './blocks/summary';
import ReferrerRanking from './blocks/referrer-rank';
import Detail from './blocks/detail';
import { eventStatusMap, DateFormat } from '../constants';
import { IStatsTitleProps } from './types';
import { ISummaryData } from '../types';
import { getOverview } from '../api/stats';
import { getReferralActive } from '../api/edit';

import './styles.scss';

const Statistics: FC<IVisRouterProps> = (props) => {
  const id = get(props, 'routeParams.id');
  const [baseInfo, setBaseInfo] = useState<IStatsTitleProps | null>(null);
  const [summaryInfo, setSummaryInfo] = useState<ISummaryData>({} as ISummaryData);

  useEffect(() => {
    Promise.all([
      getOverview({ activityId: id }),
      getReferralActive({ activityId: id }),
    ])
      .then(([summaryData, referralActiveData]) => {
        const { name, status, startAt, endAt } = referralActiveData;

        setBaseInfo({
          title: name,
          status: eventStatusMap[status],
          startTime: format(startAt, DateFormat),
          endTime: format(endAt, DateFormat),
        });

        setSummaryInfo(summaryData);
      })
      .catch((msg) => {
        Notify.error(msg || '获取活动基本信息数据失败，请稍后重试');
      });
  }, [id]);

  return (
    <div className="referral-stats">
      <div className="stats-block">
        <StatsTitle {...baseInfo} />
      </div>
      <div className="stats-block">
        <Summary {...summaryInfo} />
      </div>
      <div className="stats-block">
        <ReferrerRanking id={id} />
      </div>
      <div className="stats-block">
        <Detail id={id} />
      </div>
    </div>
  );
};

export default Statistics;
