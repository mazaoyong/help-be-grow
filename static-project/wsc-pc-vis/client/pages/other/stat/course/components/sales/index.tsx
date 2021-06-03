import React, { useState, useContext } from 'react';
import { Grid, Input, GridSortType, GridTextAlign } from 'zent';
import format from 'date-fns/format';
import startOfYesterDay from 'date-fns/start_of_yesterday';
import subDays from 'date-fns/sub_days';
import DateInput from '../../../components/date-input';
import { formatMoney } from '../../../components/charts/common';
import { useInitSalesData } from '../../hooks/sales';
import { campus } from '../../../reducers/campus';
import { DATE_TYPE } from '../../config';
import { yesterdayReady, lastValidDate } from '../../../common/config';

import './index.scss';

const yesterday = startOfYesterDay();
const end = yesterdayReady ? yesterday : subDays(yesterday, 1);

function Sales() {
  const initSortType: GridSortType = '';
  const { context } = useContext(campus);
  const [dateType, setDateType] = useState('3');
  const [startDay, setStartDay] = useState(format(subDays(end, 30), 'YYYY-MM-DD'));
  const [endDay, setEndDay] = useState(format(end, 'YYYY-MM-DD'));
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortType, setSortType] = useState(initSortType);

  const {
    list,
    total,
    loading,
  } = useInitSalesData(dateType, startDay, endDay, keyword, page, sortBy, sortType, context.subKdtId);

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setStartDay(startDayNext);
    setEndDay(endDayNext);
    setDateType(dateType);
    setPage(1);
  };

  const onChangeKeyword = (e) => {
    const { value } = e.target;
    setKeyword(value);
    setPage(1);
  };

  const onChangeTable = (conf) => {
    const { current, sortBy, sortType } = conf;
    if (typeof current !== 'undefined') {
      setPage(current);
    }
    if (typeof sortBy !== 'undefined') {
      setSortBy(sortBy);
      setSortType(sortType);
    }
  };

  const formatCourseHours = val => val ? val / 100 : 0;

  const getColumns = () => {
    const RIGHT: GridTextAlign = 'right';
    return (
      [
        {
          title: '课程名称',
          name: 'name',
          width: '19%',
        },
        {
          title: '销售课时数',
          name: 'assetNum',
          width: '13%',
          needSort: true,
          bodyRender: ({ assetNum }) => {
            return formatCourseHours(assetNum);
          },
        },
        {
          title: '收款金额(元)',
          name: 'paidAmount',
          width: '17%',
          needSort: true,
          textAlign: RIGHT,
          bodyRender: ({ paidAmount }) => {
            return formatMoney({ num: paidAmount });
          },
        },
        {
          title: '平均课时价格(元)',
          name: 'assetPriceAvg',
          width: '20%',
          needSort: true,
          textAlign: RIGHT,
          bodyRender: ({ assetPriceAvg }) => {
            return formatMoney({ num: assetPriceAvg });
          },
        },
        {
          title: '赠送课时数',
          name: 'assetGivenNum',
          width: '13%',
          needSort: true,
          bodyRender: ({ assetGivenNum }) => {
            return formatCourseHours(assetGivenNum);
          },
        },
        {
          title: '待消耗课时数',
          name: 'assetUnusedNum',
          width: '18%',
          needSort: true,
          textAlign: RIGHT,
          bodyRender: ({ assetUnusedNum }) => {
            return formatCourseHours(assetUnusedNum);
          },
        },
      ]
    );
  };

  const clsPrefix = 'sales-container';

  return (
    <div className={clsPrefix}>
      <div className={`${clsPrefix}__header`}>
        <h2>课时销售表</h2>
        <div className={`${clsPrefix}__header-right`}>
          <Input
            className={`${clsPrefix}__header-search`}
            icon="search"
            placeholder="搜索"
            inline
            width={184}
            onPressEnter={onChangeKeyword} />
          <DateInput
            config={DATE_TYPE}
            active={dateType}
            statsValid={lastValidDate}
            onChangeTime={onChangeTime}
          />
        </div>
      </div>
      <div>
        <Grid
          loading={loading}
          columns={getColumns()}
          datasets={list}
          onChange={onChangeTable}
          sortBy={sortBy}
          sortType={sortType}
          pageInfo={{
            current: page,
            pageSize: 10,
            total,
          }}
        />
      </div>
    </div>
  );
}

export default Sales;
