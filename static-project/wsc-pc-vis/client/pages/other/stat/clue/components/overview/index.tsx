import React, { useState, useContext } from 'react';
import { BlockLoading } from 'zent';
import { useInitOverviewData } from '../../hooks/overview';
import DateInput from '../../../components/date-input';
import StatisItem from '../../../components/statis-item';
import LineChart from '../../../components/charts/LineChart';
import { ECHART_LINE_OPTION } from '../../../components/charts/constants';
import formatDateStr from '../../../fns/format-date-str';
import { DATE_TYPE } from '../../config';
import { lastValidDate } from '../../../common/config';
import { campus } from '../../../reducers/campus';
import { CONFIG, ARR, TIME } from './config';

import './index.scss';

function Overview() {
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('1');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const {
    clueDataOverviewItemDTO,
    clueDataOverviewTrend,
    loading,
  } = useInitOverviewData(dateType, startDay, endDay, context.subKdtId);

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
  };

  const clsPrefix = 'overview-container';

  return (
    <div className={clsPrefix}>
      <BlockLoading loading={loading}>
        <div className={`${clsPrefix}__header`}>
          <h2>线索概况</h2>
          <DateInput
            config={DATE_TYPE}
            active={dateType}
            statsValid={lastValidDate}
            onChangeTime={onChangeTime}
          />
        </div>
        <div className={`${clsPrefix}__sum`}>
          {ARR.map((key, i) => {
            const { title, type = 'number' } = CONFIG[key];
            return (
              <StatisItem
                noHover
                key={i}
                title={`${title}${type === 'money' ? '（元）' : ''}`}
                type={type === 'number' ? 'numberThousandSymbol' : type}
                value={clueDataOverviewItemDTO[key]}
              />
            );
          })}
        </div>
        <LineChart
          notMerge
          option={{
            grid: {
              borderWidth: 0,
              x: 40,
              x2: 75,
              y: 55,
              y2: 24,
            },
            title: {
              textStyle: {
                color: '#999',
                fontSize: 12,
                fontWeight: 'normal',
                align: 'center',
              },
            },
            legend: {
              itemGap: 40,
              textStyle: {
                color: '#333',
              },
              selectedMode: true,
            },
            yAxis: [
              {
                ...ECHART_LINE_OPTION.yAxis[0],
                name: '线索数（条）',
              },
              {
                ...ECHART_LINE_OPTION.yAxis[0],
                name: '成交金额（元）',
              },
            ],
          }}
          legendInfo={{
            data: clueDataOverviewTrend.map(item => {
              item[TIME] = formatDateStr(item[TIME], dateType);
              return item;
            }),
            xAxisKey: TIME,
            yAxisKeys: ARR.map(key => {
              const { title, type, unit } = CONFIG[key];
              return {
                key,
                title,
                type,
                unit,
                yAxisIndex: type === 'money' ? 1 : 0,
                legendIcon: '',
              };
            }),
          }}
          style={{ height: '300px' }}
        />
      </BlockLoading>
    </div>
  );
}

export default Overview;
