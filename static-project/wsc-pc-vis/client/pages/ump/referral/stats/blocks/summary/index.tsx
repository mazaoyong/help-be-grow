import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import fen2yuan from 'fns/fen2yuan';
import { curDateTime, summaryTitleMap1, summaryTitleMap2, amountField } from '../../constants';

import type { ISummaryData } from '../../../types';

import './styles.scss';

const Summary: FC<ISummaryData> = (props) => {
  const getStatisticsValue = (field: string) => {
    const num = props[field] || 0;
    return amountField.includes(field) ? fen2yuan(num) : num;
  };

  return (
    <div className="referral-stats__summary">
      <h1>
        活动概况
        <Pop trigger="hover" position="top-center" content={`数据统计至${curDateTime}`}>
          <Icon className="tooltip" type="help-circle" />
        </Pop>
      </h1>
      <div className="statistics-container">
        {Object.keys(summaryTitleMap1).map((item) => (
          <div key={item} className="statistics-item">
            <p className="statistics-title">{summaryTitleMap1[item]}</p>
            <p className="statistics-value">{getStatisticsValue(item)}</p>
          </div>
        ))}
      </div>
      <div className="statistics-container">
        {Object.keys(summaryTitleMap2).map((item) => (
          <div key={item} className="statistics-item">
            <p className="statistics-title">{summaryTitleMap2[item]}</p>
            <p className="statistics-value">{getStatisticsValue(item)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
