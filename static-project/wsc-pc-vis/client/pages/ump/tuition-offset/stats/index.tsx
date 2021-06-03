import React, { FC, useState, useEffect } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { IVisRouterProps } from 'fns/router';
import { explosureTracker } from 'fns/web-tracker';
import accDiv from '@youzan/utils/number/accDiv';

import StatsTitle from './blocks/stats-title';
import Summary from './blocks/summary';
import ParticipantRanking from './blocks/participant-ranking';
import Detail from './blocks/detail';

import {
  getTuitionOffsetBaseStats,
  getTuitionOffsetStatsById,
} from '../api/stats';
import { IStatsTitleProps, IStatsSummaryProps } from './types';
import './styles.scss';

const Statistics: FC<IVisRouterProps> = props => {
  const id = get(props, 'routeParams.id');
  const [baseInfo, setBaseInfo] = useState<IStatsTitleProps | null>(null);
  const [summaryInfo, setSummaryInfo] = useState<IStatsSummaryProps | null>(null);

  useEffect(() => {
    Promise.all([
      getTuitionOffsetBaseStats({ query: { activityId: Number(id) } }),
      getTuitionOffsetStatsById({ activityId: Number(id) }),

    ])
      .then(([baseInfo, summary]) => {
        const { name, status, startAt, endAt, alias } = baseInfo;
        const { joinCnt, orderAmount, orderCnt, pv, uv } = summary;

        setBaseInfo({
          title: name,
          status,
          startTime: startAt,
          endTime: endAt,
          alias,
        });

        setSummaryInfo({
          participantCount: joinCnt,
          orderCount: orderCnt,
          orderValueSum: accDiv((Number(orderAmount) || 0), 100.0),
          uv,
          pv,
        });

        return {
          title: name,
          alias,
        };
      })
      .then(data => {
        explosureTracker({
          pageType: 'TuitionOffset',
          eventSign: 'enterpage_stats',
          eventName: '访问攒学费数据页',
          otherParams: data,
        });
      })
      .catch(e => {
        Notify.error(e || '获取活动基本信息数据失败，请稍后重试');
      });
  }, [id]);

  return (
    <div className="tuition-offset-stats">
      <div className="stats-block">
        <StatsTitle { ...baseInfo } />
      </div>
      <div className="stats-block">
        <Summary { ...summaryInfo } />
      </div>
      <div className="stats-block">
        <ParticipantRanking id={id} />
      </div>
      <div className="stats-block">
        <Detail id={id} />
      </div>
    </div>
  );
};

export default Statistics;
