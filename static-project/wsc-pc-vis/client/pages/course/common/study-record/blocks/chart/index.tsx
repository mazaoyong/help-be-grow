import React, { FC, useState, useEffect, useCallback } from 'react';
import { Notify } from 'zent';
import { TChartDataLines, IChartRawData, IStudyRecordPageProps } from '../../types';
import ChartFC from '../../components/chart';
import DaterangeFC from '../../components/date-range';
import travel from '@youzan/utils/date/travel';
// import compare from '@youzan/utils/date/compare';
import { parseChartData } from '../../utils/chart';
import { getTrend } from '../../api';
import formatDate from '@youzan/utils/date/formatDate';
import './style.scss';

const ChartWrapper: FC<IStudyRecordPageProps> = (props) => {
  const { courseId, courseType } = props;

  const [ chartData, setChartData ] = useState<TChartDataLines>([]);
  const [ xAisxData, setXAisxData ] = useState<string[]>([]);
  const [ dateRange, setDateRange ] = useState<[Date, Date]>(
    () => {
      const now = new Date();
      const day = now.getDate();
      return [ travel(1 - day, now), now ];
    }
  );

  const onDateChange: (vals: any[]) => void = useCallback((vals) => {
    const changeValue: [ Date, Date] = [ new Date(vals[0]), new Date(vals[1]) ];
    setDateRange(changeValue);
  }, [ dateRange ]);

  useEffect(() => {
    if (dateRange.length < 2 || dateRange[0].getMonth() !== dateRange[1].getMonth()) {
      Notify.error('只能查看同一个月内的数据');
    } else {
      getTrend({ query: {
        courseId,
        courseType,
        startDay: formatDate(dateRange[0], 'YYYYMMDD'),
        endDay: formatDate(dateRange[1], 'YYYYMMDD')
      } })
        .then((resp: IChartRawData) => {
          if (resp) {
            const parseData:TChartDataLines = parseChartData(resp);
            setChartData(parseData);
            setXAisxData(Object.keys(resp));
          }
        })
        .catch(err => Notify.error(err));
    }
  }, [ dateRange, courseId, courseType ]);

  return (
    <div className='study-record__block'>
      <p className='study-record__title'>数据趋势</p>
      <div className='study-trend__wrapper'>
        <DaterangeFC onDateChange={onDateChange} value={dateRange} />
      </div>
      <ChartFC chartData={chartData} xAisxData={xAisxData}/>
    </div>
  );
};

export default ChartWrapper;
