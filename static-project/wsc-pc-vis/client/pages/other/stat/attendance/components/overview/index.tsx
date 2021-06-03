import React, { useState, useContext } from 'react';
import { BlockLoading, Radio } from 'zent';
import { set, get } from 'lodash';
import { ECHART_LINE_OPTION } from '../../../components/charts/constants';
import { useInitOverviewData, IResponseModel } from '../../hooks/overview';
import DateInput from '../../../components/date-input';
import StatisItem from '../../../components/statis-item';
import LineChart from '../../../components/charts/LineChart';
import BarChart from '../../../components/charts/BarChart';
import { formatPercent } from '../../../components/charts/common';
import formatDateStr from '../../../fns/format-date-str';
import { DATE_TYPE } from '../../config';
import { lastValidDate } from '../../../common/config';
import { campus } from '../../../reducers/campus';
import { CONFIG, ARR, TIME, lineOption, columnOption } from './config';

import './index.scss';

const RadioGroup = Radio.Group;

function showAllIndicators(chartType, chartValue) {
  return chartType === 'line' && chartValue === 'value';
}

function Overview() {
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('1');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [chartValue, setChartValue] = useState('value');
  const [chartType, setChartType] = useState('column');
  const showAll = showAllIndicators(chartType, chartValue);

  const chartArr = showAll ? ARR : ARR.slice(1, ARR.length);
  const defaultSelected = {};
  chartArr.map(key => {
    defaultSelected[CONFIG[key].title] = true;
  });

  const [selected, setSelected] = useState(defaultSelected);
  const {
    overviewItemDTO,
    overviewItemTrendDTO,
    loading,
  } = useInitOverviewData(dateType, startDay, endDay, context.subKdtId);

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
  };

  const onChangeType = () => {
    setSelected(defaultSelected);
  };

  const changeChartValue = e => {
    setChartValue(e.target.value);
  };

  const changeChartType = e => {
    setChartType(e.target.value);
    setSelected(defaultSelected);
  };

  const processOption = (option = {}) => {
    set(option, 'tooltip.formatter', series => {
      const { axisValueLabel, dataIndex } = series[0];
      const total = get(overviewItemTrendDTO, `[${dataIndex}].scheduledStuCnt`);
      let text = `${axisValueLabel}<br/>` + (showAll ? '' : `应到人次：${total} 人<br/>`);
      return text + series.map(serie => {
        const { seriesName, seriesIndex, dataIndex, marker } = serie;
        const value = overviewItemTrendDTO[dataIndex][chartArr[seriesIndex]];
        const percent = total ? `(${formatPercent({
          num: value / total,
          withPercentSign: true,
        })})` : '';
        return `${marker}${seriesName}：${value} 人 ${percent}`;
      }).join('<br/>');
    });
    return option;
  };

  const clsPrefix = 'attendance-overview-container';
  const data = overviewItemTrendDTO.map(item => {
    const { scheduledStuCnt } = item;
    const parsedItem = {} as IResponseModel;
    Object.keys(item).map(key => {
      if (key === TIME) {
        parsedItem[key] = formatDateStr(item[key], dateType);
      } else if (chartValue === 'percent') {
        parsedItem[key] = scheduledStuCnt ? item[key] / +scheduledStuCnt * 100 : 0;
      } else {
        parsedItem[key] = item[key];
      }
    });
    return parsedItem;
  });

  const option = {
    ...(chartType === 'line' ? lineOption : columnOption),
    yAxis: [
      {
        ...ECHART_LINE_OPTION.yAxis[0],
        name: chartValue === 'value' ? '应到人次（人）' : '百分比（%）',
      },
    ],
  };
  option.legend.selected = selected;

  return (
    <div className={clsPrefix}>
      <BlockLoading loading={loading}>
        <div className={`${clsPrefix}__header`}>出勤概况</div>
        <div className={`${clsPrefix}__picker`}>
          <span className={`${clsPrefix}__picker-label`}>时间筛选：</span>
          <DateInput
            config={DATE_TYPE}
            active={dateType}
            statsValid={lastValidDate}
            onChangeTime={onChangeTime}
            onChangeType={onChangeType}
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
                value={overviewItemDTO[key]}
              />
            );
          })}
        </div>
        <div className={`${clsPrefix}__radio`}>
          <div className={`${clsPrefix}__radio-group`}>
            数据格式：
            <RadioGroup
              value={chartValue}
              onChange={changeChartValue}
            >
              <Radio value="value">数值</Radio>
              <Radio value="percent">百分比</Radio>
            </RadioGroup>
          </div>
          <div className={`${clsPrefix}__radio-group`}>
            图表类型：
            <RadioGroup
              value={chartType}
              onChange={changeChartType}
            >
              <Radio value="column">条形统计图</Radio>
              <Radio value="line">折线统计图</Radio>
            </RadioGroup>
          </div>
        </div>
        {
          chartType === 'line' ? (
            <LineChart
              notMerge
              option={option}
              postProcessOption={processOption}
              legendInfo={{
                data,
                xAxisKey: TIME,
                yAxisKeys: chartArr.map(key => {
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
              onEvents={{
                legendselectchanged: params => {
                  const { selected } = params;
                  setSelected(selected);
                },
              }}
              style={{ height: '300px' }}
            />
          ) : (
            <BarChart
              notMerge
              option={option}
              postProcessOption={processOption}
              legendInfo={{
                data,
                xAxisKey: 'currentDay',
                yAxisKeys: chartArr.map(key => {
                  const { title, type, unit } = CONFIG[key];
                  return {
                    key,
                    title,
                    type,
                    unit,
                    seriesOption: {
                      stack: '0',
                    },
                  };
                }),
              }}
              onEvents={{
                legendselectchanged: params => {
                  const { selected } = params;
                  setSelected(selected);
                },
              }}
              style={{ height: '300px' }}
            />
          )
        }
      </BlockLoading>
    </div>
  );
}

export default Overview;
