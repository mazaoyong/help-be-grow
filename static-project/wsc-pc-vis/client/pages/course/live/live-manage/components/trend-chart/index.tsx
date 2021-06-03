import { DateRangePicker } from '@zent/compat';
import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Notify, Button, BlockLoading } from 'zent';
import { Color, Grid, Legend, RechartsLayout, SeriesLine, Tooltip, XAxis, YAxis } from '@youzan/react-charts';
import date from '@youzan/utils/date';

import { listDateTrend } from '../../../api/live-manage';
import { ILiveManageRecordManage, ILiveSummary, DateType } from '../../types';
import './styles.scss';

const { formatDate, travel, parseDate } = date;

const oneDay = 24 * 60 * 60 * 1000;
const now = new Date();

const parseChartData = (datelist: string[], chartData) => {
  const parsedData = {
    averageWatchDuration: [],
    averageWatchTimes: [],
    watchCount: [],
    watchDuration: [],
    watchTimes: [],
  };

  datelist.map(date => {
    if (chartData[date]) {
      Object.keys(parsedData).forEach(key => {
        parsedData[key].push(chartData[date][key]);
      });
    } else {
      Object.keys(parsedData).forEach(key => {
        parsedData[key].push(0);
      });
    };
  });

  return parsedData;
};

const TrendChart: FC<ILiveManageRecordManage> = ({ alias }) => {
  const [isChartLoaded, toggleIsChartLoaded] = useState(true); // 数据趋势是否请求成功
  const [isChartLoading, toggleIsChartLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<[DateType?, DateType?]>([
    formatDate(travel(-30), 'YYYY-MM-DD'),
    formatDate(travel(-1), 'YYYY-MM-DD'),
  ]);
  const [chartData, setChartData] = useState<Record<keyof Partial<ILiveSummary>, number[]>>({
    averageWatchDuration: [],
    averageWatchTimes: [],
    watchCount: [],
    watchDuration: [],
    watchTimes: [],
  });

  const datelist = useMemo(() => {
    const [startDate, endDate] = timeRange;
    if (!startDate || !endDate) return [];

    const dates: string[] = [startDate as string];
    const startTimestamp = parseDate(startDate as string, 'YYYY-MM-DD').getTime();
    const endTimestamp = parseDate(endDate as string, 'YYYY-MM-DD').getTime();

    let i = 1;
    while (startTimestamp + i * oneDay <= endTimestamp) {
      dates.push(formatDate(startTimestamp + i * oneDay, 'YYYY-MM-DD'));
      i++;
    };

    return dates;
  }, [timeRange]);

  const getTrend = useCallback(() => {
    const eduLiveDateTrendQuery = {
      alias,
      startDate: (timeRange[0] || '') as string,
      endDate: (timeRange[1] || '') as string,
    };

    toggleIsChartLoading(true);
    toggleIsChartLoaded(true);
    listDateTrend({ eduLiveDateTrendQuery })
      .then(res => {
        if (res) {
          const { dailySumDTOList = [] } = res;
          let chartData = {};

          dailySumDTOList.map(dateData => {
            const {
              averageWatchDuration = '0',
              averageWatchTimes = '0',
              dateAt = 1590940800000,
              watchCount = 0,
              watchDuration = '0',
              watchTimes = 0,
            } = dateData;
            const time = formatDate(dateAt, 'YYYY-MM-DD');
            chartData[time] = {
              averageWatchDuration: Number(averageWatchDuration),
              averageWatchTimes: Number(averageWatchTimes),
              watchCount,
              watchDuration: Number(watchDuration),
              watchTimes,
            };
          });

          setChartData(parseChartData(datelist, chartData));
        }
      })
      .catch(e => {
        Notify.error(e || '请求数据趋势超时，请点击重试');
        toggleIsChartLoaded(false);
      })
      .finally(() => {
        toggleIsChartLoading(false);
      });
  }, [alias, datelist, timeRange]);

  useEffect(() => {
    setTimeout(() => { // 保证时间轴先渲染完毕
      getTrend();
    }, 500);
  }, [getTrend]);

  const disabledDate = useCallback((val: DateType) => {
    const endDate = timeRange[1];
    if (!endDate) {
      return now.getTime() < parseDate(val as string, 'YYYY-MM-DD').getTime();
    }
    return (
      now.getTime() < parseDate(val as string, 'YYYY-MM-DD').getTime() ||
      parseDate(endDate as string, 'YYYY-MM-DD').getTime() - 89 * oneDay > parseDate(val as string, 'YYYY-MM-DD').getTime()
    );
  }, [timeRange]);

  const lineDatas = useMemo(() => {
    const {
      averageWatchDuration = [],
      averageWatchTimes = [],
      watchCount = [],
      watchDuration = [],
      watchTimes = [],
    } = chartData;
    return [{
      name: '学习人数',
      data: watchCount,
    },
    {
      name: '学习次数',
      data: watchTimes,
    },
    {
      name: '学习时长（分钟）',
      data: watchDuration,
    },
    {
      name: '人均学习次数',
      data: averageWatchTimes,
    },
    {
      name: '人均学习时长（分钟）',
      data: averageWatchDuration,
    }];
  }, [chartData]);

  return (
    <>
      <DateRangePicker
        className="date-range-picker"
        value={timeRange}
        disabledDate={disabledDate}
        onChange={(val: [DateType?, DateType?]) => {
          const [startDate = '', endDate = ''] = val;
          if (!startDate || !endDate) {
            setTimeRange(val);
            return;
          }
          if (parseDate(endDate as string, 'YYYY-MM-DD').getTime() -
            parseDate(startDate as string, 'YYYY-MM-DD').getTime() > 89 * oneDay) {
            setTimeRange([formatDate(travel(-89, parseDate(endDate as string, 'YYYY-MM-DD')), 'YYYY-MM-DD'), endDate]);
            return;
          }
          setTimeRange(val);
        }}
      />
      {!isChartLoaded
        ? <div className="chart-hover">
          <Button
            className="refresh"
            loading={isChartLoading}
            onClick={getTrend}
          >
            刷新
          </Button>
        </div>
        : null}
      <BlockLoading loading={isChartLoading}>
        <RechartsLayout
          style={{
            height: 360,
          }}
        >
          <Grid />
          <Color />
          <Legend selected={{
            '人均学习次数': false,
            '人均学习时长（分钟）': false
          }}/>
          {lineDatas.map(config => (
            <SeriesLine key={config.name} name={config.name} data={config.data} />
          ))}
          <XAxis data={datelist} />
          <YAxis />
          <Tooltip trigger="axis" />
        </RechartsLayout>
      </BlockLoading>
    </>
  );
};

export default TrendChart;
