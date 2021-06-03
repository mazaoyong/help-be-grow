import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import { curDateTime } from '../../constants';

import type { IStatsSummaryProps } from '../../types';

import './styles.scss';

const summaryTitleMap: Record<keyof IStatsSummaryProps, string> = {
  participantCount: '参与人数',
  orderCount: '订单数',
  orderValueSum: '订单总金额(元)',
  uv: '浏览人数',
  pv: '浏览量',
};

const Summary: FC<IStatsSummaryProps> = (props) => {
  return (
    <div className="tuition-offset-stats__summary">
      <h1>
        活动概况
        <Pop
          trigger="hover"
          position="top-center"
          content={`浏览量、浏览人数数据统计至${curDateTime}，其余数据统计至前一天`}
        >
          <Icon className="tooltip" type="help-circle" />
        </Pop>
      </h1>
      <div className="statistics-container">
        {Object.keys(summaryTitleMap)
          .map(item => (
            <div key={item} className="statistics-item">
              <p className="statistics-title">{summaryTitleMap[item]}</p>
              <p className="statistics-value">{props[item] || '0'}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Summary;
