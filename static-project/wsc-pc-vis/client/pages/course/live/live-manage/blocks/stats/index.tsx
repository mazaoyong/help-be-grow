import { Pop } from '@zent/compat';
import React, { FC, useState, useEffect } from 'react';
import { Icon, Notify } from 'zent';
import date from '@youzan/utils/date';

import SummaryCardList from '../../components/summary-card-list';
import DetailList from '../../components/detail-list';
import TrendChart from '../../components/trend-chart';

import { getLiveSurvey } from '../../../api/live-manage';
import { summaryKeyList, defaultLiveSummary, liveSummaryKeyMap } from './constants';
import { ILiveManageRecordManage, ILiveSummary } from '../../types';
import './styles.scss';

const { formatDate } = date;

const parseCardlistConfig = (liveSummary?: ILiveSummary) => {
  if (!liveSummary) return [];
  return summaryKeyList
    .map(key => ({
      title: liveSummaryKeyMap[key],
      value: liveSummary[key],
    }));
};

const Stats: FC<ILiveManageRecordManage> = props => {
  const [liveSummary, setLiveSummary] = useState<ILiveSummary>(defaultLiveSummary);

  useEffect(() => {
    const eduLiveSurveyQuery = {
      alias: props.alias,
    };
    getLiveSurvey({ eduLiveSurveyQuery })
      .then(res => {
        if (res) {
          setLiveSummary(res);
        }
      })
      .catch(e => {
        Notify.error(e || '请求直播概况超时，请稍后重试');
      });
  }, [props.alias]);

  return (
    <>
      <div className="live-manage__stats">
        <div className="live-summary">
          <div className="header">
            <h1 className="subtitle">直播概况</h1>
            <span className="desc">
              数据更新时间：
              {liveSummary.updateAt
                ? formatDate(liveSummary.updateAt, 'YYYY年MM月DD日 HH:mm')
                : '加载中...'
              }
              <Pop
                trigger="hover"
                position="top-center"
                content="每日凌晨将更新截至前一日的数据，包含用户通过回放进行学习的数据。"
              >
                <Icon className="tooltip" type="help-circle" />
              </Pop>
            </span>
          </div>
          <div className="body">
            <SummaryCardList config={parseCardlistConfig(liveSummary)} />
          </div>
        </div>

        <div className="trend">
          <div className="header">
            <h1 className="subtitle">数据趋势</h1>
          </div>
          <div className="body">
            <span className="text">时间筛选：</span>
            <TrendChart {...props} />
          </div>
        </div>
      </div>
      <div className="live-manage__user-detail">
        <h1 className="subtitle">学习明细</h1>
        <div className="body">
          <DetailList {...props} />
        </div>
      </div>
    </>
  );
};

export default Stats;
