import React, { useState, useContext } from 'react';
import { BlockLoading, Grid, GridTextAlign } from 'zent';
import set from 'lodash/set';
import { formatMoney } from '../../../components/charts/common';
import { useInitStudentData } from '../../hooks/student';
import PieChart from '../../../components/charts/PieChart';
import DateInput from '../../../components/date-input';
import ChangeTrend from '../../../components/change-trend';
import { campus } from '../../../reducers/campus';
import { DATE_TYPE } from '../../config';
import { lastValidDate } from '../../../common/config';

import './index.scss';

const trendMap = {
  0: 0, // 无
  1: -1, // 下降
  2: 1, // 上升
};

function Student() {
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('3');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const {
    list,
    loading,
    data,
  } = useInitStudentData(
    dateType,
    startDay,
    endDay,
    context.subKdtId,
  );

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
  };

  const processOption = (option = {}) => {
    set(option, 'series[0].tooltip.formatter', params => {
      const { marker, data, percent, dataIndex } = params;
      return `${marker}${data.name}<br/>收款金额：${formatMoney({ num: data.value })} 元<br/>报名学员数：${list[dataIndex].count}人<br/>占比：${percent}%`;
    });
    return option;
  };

  const dataCompareStr = dateType === '1' ? '较前一日' : '较前一月';

  const getColumns = () => {
    const clsPrefix = 'compare-value';
    const align: GridTextAlign = 'left';
    return (
      [
        {
          title: '学员类型',
          name: 'name',
          width: '16%',
        },
        {
          title: (
            <div className={clsPrefix}>
              <span className={`${clsPrefix}__item`}>收款金额(元)</span>
              <span className={`${clsPrefix}__item`}>{dataCompareStr}</span>
            </div>
          ),
          width: '42%',
          bodyRender: ({ amount, amountLastRate, amountLastTrend }) => {
            return (
              <div className={clsPrefix}>
                <span className={`${clsPrefix}__item`}>{formatMoney({ num: amount })}</span>
                <span className={`${clsPrefix}__item`}>
                  <span className="rank-title-container">
                    <ChangeTrend growth={trendMap[amountLastTrend]} />
                    {amountLastRate}
                  </span>
                </span>
              </div>
            );
          },
        },
        {
          title: (
            <div className={clsPrefix}>
              <span className={`${clsPrefix}__item`}>报名学员数</span>
              <span className={`${clsPrefix}__item`}>{dataCompareStr}</span>
            </div>
          ),
          width: '42%',
          textAlign: align,
          bodyRender: ({ count, countLastRate, countLastTrend }) => {
            return (
              <div className={clsPrefix}>
                <span className={`${clsPrefix}__item`}>{count}</span>
                <span className={`${clsPrefix}__item`}>
                  <span className="rank-title-container">
                    <ChangeTrend growth={trendMap[countLastTrend]} />
                    {countLastRate}
                  </span>
                </span>
              </div>
            );
          },
        },
      ]
    );
  };

  const clsPrefix = 'student-container';

  return (
    <div className={clsPrefix}>
      <BlockLoading loading={loading}>
        <div className={`${clsPrefix}__header`}>
          <h2>
            报名学员构成
            {/* <a className="export-link">导出</a> */}
          </h2>
          <div className={`${clsPrefix}__header-right`}>
            <DateInput
              config={DATE_TYPE}
              active={dateType}
              statsValid={lastValidDate}
              onChangeTime={onChangeTime}
            />
          </div>
        </div>
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
                  selectedMode: false,
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
              style={{ height: '292px' }}
            />
          </div>
          <div className={`${clsPrefix}__content-table`}>
            <Grid
              columns={getColumns()}
              datasets={list}
            />
          </div>
        </div>
      </BlockLoading>
    </div>
  );
}

export default Student;
