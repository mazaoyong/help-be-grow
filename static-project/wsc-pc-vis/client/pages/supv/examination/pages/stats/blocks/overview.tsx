import React, { FC, useState, useEffect, ReactNode } from 'react';
import { Notify } from 'zent';
import { IBlockBaseProps, IStatsOverviewData } from '../types';

import { getStatsOverviewData } from '../../../api';
import { SCORE_MULTIPLIER } from '../../../constants';

/** 数据列表配置 */
interface IInfoConfig {
  /** 数据标签 */
  text: string;
  /** 数据在数据对象中的 key 值 */
  key: string;
  /** 数据值的颜色 */
  color?: string;
  /** 数据值的后缀 */
  suffix?: string;
}

const scoreInfoConfig: IInfoConfig[] = [
  {
    text: '总分',
    key: 'totalScore',
  },
  {
    text: '平均分',
    key: 'averageScore',
  },
  {
    text: '最高分',
    key: 'highestScore',
  },
  {
    text: '最低分',
    key: 'lowestScore',
  },
];
const submitInfoConfig: IInfoConfig[] = [
  {
    text: '未提交',
    key: 'unsubmitted',
    color: '#d40000',
  },
  {
    text: '已提交',
    key: 'submitted',
    color: '#2da641',
  },
  {
    text: '未批改',
    key: 'unreviewed',
  },
  {
    text: '已批改',
    key: 'reviewed',
  },
];

interface IDataListProps {
  config: IInfoConfig[];
  data: IStatsOverviewData;
  format?: (value: any, key: string) => ReactNode;
  suffix?: string
}

const DataList: FC<IDataListProps> = (
  {
    config,
    data,
    format,
    suffix = ''
  }
) => (
  <dl className="statspage__overview--info-datalist">
    {config.map(item => {
      const { text, key, color } = item;
      const value = format ? format(data[key], key) : data[key];
      return (
        <div key={item.key} className="statspage__overview--info-datalist-item">
          <dt className="statspage__overview--info-datalist-label">
            {text}
          </dt>
          <dd>
            <span
              className="statspage__overview--info-datalist-value"
              style={{ color }}
            >
              {value == null ? '-' : value}
            </span> {suffix}
          </dd>
        </div>
      );
    },
    )}
  </dl>
);

const Overview: FC<IBlockBaseProps> = ({ examTemplateId }) => {
  const [statsOverviewData, setStatsOverviewData] = useState<IStatsOverviewData>({});

  useEffect(() => {
    getStatsOverviewData(examTemplateId).then(resp => {
      setStatsOverviewData(resp);
    }).catch((msg) => {
      Notify.error(msg || '网络错误');
    });
  }, [examTemplateId]);

  const { duration = 0, limitType = 2, limitTimes = 0 } = statsOverviewData;
  // 考试时长
  const durationText = duration > 0
    ? `${(duration / 60).toFixed(2)} 分钟`
    : '不限';
  // 次数限制
  const limitTimeText = limitType === 2
    ? '不限'
    : `${limitTimes} 次`;

  return (
    <header className="statspage__overview">
      <h1 className="statspage__overview--title">
        考试名称：{statsOverviewData.title || '-'}
        <span className="statspage__overview--title-desc">
          时长：{durationText}
        </span>
        <span className="statspage__overview--title-desc">
          次数：{limitTimeText}
        </span>
      </h1>
      <section className="statspage__overview--info">
        <DataList
          config={scoreInfoConfig}
          data={statsOverviewData}
          format={(value = 0) => (value / SCORE_MULTIPLIER)}
        />
        <DataList config={submitInfoConfig} data={statsOverviewData} suffix="人"/>
      </section>
    </header>
  );
};

export default Overview;
