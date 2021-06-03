import { Select } from '@zent/compat';
import React, { useState, useContext } from 'react';
import { BlockLoading, Grid, Tabs, BlockHeader, GridTextAlign } from 'zent';
import set from 'lodash/set';
import { isEduChainStore } from '@youzan/utils-shop';
import { formatNumber, formatMoney } from '../../../components/charts/common';
import LineChart from '../../../components/charts/LineChart';
import { ECHART_LINE_OPTION } from '../../../components/charts/constants';
import { useInitSourceData } from '../../hooks/source';
import PieChart from '../../../components/charts/PieChart';
import DateInput from '../../../components/date-input';
import ChangeTrend from '../../../components/change-trend';
import SourceSelectPop from '../../../components/source-select-pop';
import { campus } from '../../../reducers/campus';
import formatDateStr from '../../../fns/format-date-str';
import { DATE_TYPE } from '../../config';
import { lastValidDate } from '../../../common/config';
import { CONFIG, TIME } from './config';

import './index.scss';

const trendMap = {
  0: 0, // 无
  1: -1, // 下降
  2: 1, // 上升
};

function Source() {
  const initSourceIdList: number[] = [];
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('3');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [dataType, setdataType] = useState(1);
  const [statType, setStatType] = useState('clue_new');
  const [sourceIdList, setSourceIdList] = useState(initSourceIdList);
  const [showSourceIdList, setShowSourceIdList] = useState(initSourceIdList);
  const {
    list,
    trend,
    loading,
    data,
    name,
    setTrend,
    setName,
  } = useInitSourceData(
    dateType,
    startDay,
    endDay,
    dataType,
    statType,
    sourceIdList,
    setSourceIdList,
    setShowSourceIdList,
    context.subKdtId,
  );

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
    setSourceIdList([]);
    setShowSourceIdList([]);
  };

  const processOption = (option = {}) => {
    const { title, unit } = CONFIG[statType];
    set(option, 'series[0].tooltip.formatter', params => {
      const { marker, data, percent } = params;
      return `${marker}${data.name}<br/>${title}：${data.value} ${unit}<br/>占比：${percent}%`;
    });
    return option;
  };

  const onSelectChange = e => {
    setdataType(e.target.value);
    setSourceIdList([]);
    setShowSourceIdList([]);
  };

  const onTabChange = statType => {
    setStatType(statType);
    setSourceIdList([]);
    setShowSourceIdList([]);
  };

  const onSourceChange = (_type, ids) => {
    setShowSourceIdList(ids);
    if (!ids.length) {
      setTrend([]);
      setName({});
    } else {
      setSourceIdList(ids);
    }
  };

  const isMoney = statType === 'clue_deal_amount';
  const { title, type } = CONFIG[statType];

  const getColumns = () => {
    const RIGHT: GridTextAlign = 'right';
    return (
      [
        {
          title: '来源',
          name: 'sourceName',
          width: '36%',
        },
        {
          title,
          name: 'statValue',
          width: '27%',
          bodyRender: ({ statValue }) => {
            return isMoney ? formatMoney({ num: statValue }) : formatNumber({ num: statValue });
          },
        },
        {
          title: dateType === '1' ? '较前一日' : '较前一月',
          name: 'lastRate',
          width: '22%',
          bodyRender: ({ lastRate, trend }) => {
            return (
              <div className="rank-title-container">
                <ChangeTrend growth={trendMap[trend]} />
                {lastRate}
              </div>
            );
          },
        },
        {
          title: '占比',
          name: 'proportion',
          width: '15%',
          textAlign: RIGHT,
        },
      ]
    );
  };

  if (isEduChainStore && !context.subKdtId) return null;

  const clsPrefix = 'source-container';

  return (
    <div className={clsPrefix}>
      <BlockLoading loading={loading}>
        <div className={`${clsPrefix}__header`}>
          <h2>
            线索来源分析
            {/* <a className="export-link">导出</a> */}
          </h2>
          <div className={`${clsPrefix}__header-right`}>
            <Select
              autoWidth
              className="select-source"
              value={dataType}
              width="160px"
              onChange={onSelectChange}
              data={[{
                value: 1,
                text: '来源',
              }, {
                value: 2,
                text: '来源分组',
              }]}
            />
            <DateInput
              config={DATE_TYPE}
              active={dateType}
              statsValid={lastValidDate}
              onChangeTime={onChangeTime}
            />
          </div>
        </div>
        <Tabs
          activeId={statType}
          onChange={onTabChange}
          type="button"
          tabs={[
            {
              title: '新增线索',
              key: 'clue_new',
            },
            {
              title: '成交线索',
              key: 'clue_deal',
            },
            {
              title: '成交金额',
              key: 'clue_deal_amount',
            },
          ]}
        />
        <BlockHeader
          className="block-header"
          title="线索构成分析"
          tooltip={<span>筛选周期内，各来源分组/来源的线索变化情况</span>}
          position="top-center"
        />
        <div className={`${clsPrefix}__content`}>
          <div className={`${clsPrefix}__content-chart`}>
            <PieChart
              notMerge
              option={{
                legend: {
                  left: '60%',
                  padding: [0, 0, 0, 40],
                  top: '125px',
                  orient: 'vertical',
                  align: 'left',
                  formatter: function(name) {
                    if (name && name.length > 6) {
                      name = name.slice(0, 6) + '...';
                    }
                    return name;
                  },
                  tooltip: {
                    show: true,
                  },
                },
              }}
              legendInfo={{
                data,
                seriesOption: {
                  center: ['30%', '50%'],
                  radius: ['30%', '60%'],
                },
                mapKeys: Object.keys(data).map(key => {
                  return {
                    key,
                    title: key,
                    type: 'number',
                    legend: key,
                  };
                }),
              }}
              processOption={processOption}
              style={{ height: '450px' }}
            />
          </div>
          <div className={`${clsPrefix}__content-table`}>
            <Grid
              columns={getColumns()}
              datasets={list}
            />
          </div>
        </div>
        <BlockHeader
          className="block-header"
          title="来源趋势分析"
          rightContent={
            <SourceSelectPop
              kdtId={context.subKdtId}
              type={dataType === 1 ? 'source' : 'group'}
              indicatrix={showSourceIdList}
              onChange={onSourceChange}
            />
          }
        />
        <LineChart
          notMerge
          option={{
            grid: {
              borderWidth: 0,
              x: 40,
              x2: 45,
              y: 80,
              y2: 24,
            },
            legend: {
              itemGap: 10,
              textStyle: {
                color: '#333',
                padding: [0, 30, 0, 0],
              },
              top: 0,
              formatter: function(name) {
                if (name && name.length > 10) {
                  name = name.slice(0, 10) + '...';
                }
                return name;
              },
            },
            yAxis: [
              {
                ...ECHART_LINE_OPTION.yAxis[0],
                name: isMoney ? '金额（元）' : '线索数（条）',
              },
            ],
          }}
          legendInfo={{
            data: trend.map(item => {
              item[TIME] = formatDateStr(item[TIME], dateType);
              return item;
            }),
            xAxisKey: 'currentDay',
            yAxisKeys: Object.keys(name).map(key => {
              return {
                key,
                title: name[key],
                type,
                legendIcon: '',
                unit: isMoney ? '元' : '条',
              };
            }),
          }}
          style={{ height: '350px' }}
        />
      </BlockLoading>
    </div>
  );
}

export default Source;
