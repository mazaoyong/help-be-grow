import React, { useState, useContext, useRef, useCallback, useEffect, useMemo } from 'react';
import { Button, Notify } from 'zent';
import { get } from 'lodash';
import { EasyList } from '@youzan/ebiz-components';
import {
  IListProps,
  IListContext,
} from '@youzan/ebiz-components/components/easy-list/types/list';
import {
  ICombinedFilterConf,
  IFilterProps,
} from '@youzan/ebiz-components/components/easy-list/types/filter';
import { IEasyGridColumn } from '@youzan/ebiz-components/components/easy-list/types/grid';
import format from 'date-fns/format';
import startOfYesterDay from 'date-fns/start_of_yesterday';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';
import subMonths from 'date-fns/sub_months';
import isLastDayOfMonth from 'date-fns/is_last_day_of_month';
import subDays from 'date-fns/sub_days';
import DateInput from '../../../components/date-input';
import { campus } from '../../../reducers/campus';
import { DATE_TYPE, DATA_TYPE } from '../../config';
import { hqKdtId, lastMonthReady, lastValidDate } from '../../../common/config';
import { getQueryType } from '../../../common/helper';
import { findAttendClassDetailPage, exportAttendClassDetail } from '../../api';
import { IListParams } from './model';

import './index.scss';

const { List, Filter, EasyGrid } = EasyList;
const yesterday = startOfYesterDay();
const end = lastMonthReady ? yesterday : subDays(yesterday, 1);
const lastDay = isLastDayOfMonth(end) ? end : subMonths(end, 1);
const SELECT_WIDTH = 185;
const initDate = {
  dateType: '3',
  startDay: format(startOfMonth(lastDay), 'YYYY-MM-DD'),
  endDay: format(endOfMonth(lastDay), 'YYYY-MM-DD'),
  resetTrigger: false,
};

function AttendanceList() {
  const { context } = useContext(campus);
  const [dataType, setDataType] = useState('4'); // 点击筛选后改变维度
  const [currentDataType, setCurrentDataType] = useState('4'); // 选择后改变维度
  const [date, setDate] = useState(initDate);
  const listRef = useRef<IListContext>(null);

  const onChangeTime = (timeArr, dateType) => {
    const [startDayNext, endDayNext] = timeArr;
    setDate({
      dateType,
      startDay: startDayNext,
      endDay: endDayNext,
      resetTrigger: false,
    });
  };

  const onChangeDataType = type => {
    setCurrentDataType(type);
  };

  const filterConfig = useMemo(() => [
    {
      name: 'dataType',
      label: '维度筛选：',
      defaultValue: currentDataType,
      type: 'Select',
      options: DATA_TYPE,
      inheritProps: { width: SELECT_WIDTH },
      onChange: onChangeDataType,
    },
    {
      name: 'dateParam',
      label: '时间筛选：',
      type: 'Custom',
      renderField: DateInput,
      inheritProps: {
        config: DATE_TYPE,
        active: date.dateType,
        statsValid: lastValidDate,
        onChangeTime: onChangeTime,
        resetTrigger: date.resetTrigger,
      },
    },
  ] as ICombinedFilterConf[], [date, currentDataType]);

  const Actions: IFilterProps['renderActions'] = ({ filter }) => {
    const { submit, reset, getCurrentValues } = filter;
    const resetFilter = () => {
      setDataType('4');
      setCurrentDataType('4');
      setDate({ ...initDate, resetTrigger: true });
      reset();
    };

    return (
      <>
        <Button
          type='primary'
          onClick={() => {
            submit();
          }}
        >
          筛选
        </Button>
        <Button
          onClick={() => {
            exportList(getCurrentValues());
          }}
        >
          导出报表
        </Button>
        <Button
          onClick={openExportRecord}
        >
          查看已生成的报表
        </Button>
        <Button type='primary' bordered={false} outline onClick={resetFilter}>
          重置筛选条件
        </Button>
      </>
    );
  };

  const columns = useMemo(() => {
    const title = get(DATA_TYPE.filter(item => item.value === dataType), '[0].text') + '名称';
    return (
      [
        {
          title,
          name: 'name',
          width: '19%',
        },
        {
          title: '上课次数',
          name: 'signedScheduleCnt',
          needSort: true,
        },
        {
          title: '排课次数',
          name: 'scheduleCnt',
          needSort: true,
        },
        {
          title: '应到人次',
          name: 'scheduledStuCnt',
          needSort: true,
        },
        {
          title: '已到人次',
          name: 'signedStuCnt',
          needSort: true,
        },
        {
          title: '出勤率',
          name: 'attendanceRate',
        },
        {
          title: '请假人次',
          name: 'dayOffStuCnt',
          needSort: true,
        },
        {
          title: '未到人次',
          name: 'absentStuCnt',
          needSort: true,
        },
        {
          title: '试听人次',
          name: 'trialStuCnt',
          needSort: true,
        },
      ] as IEasyGridColumn[]
    );
  }, [dataType]);

  const getNewFetchParams = useCallback((conf) => {
    const {
      page,
      sortBy,
      sortType,
    } = conf;

    const data: IListParams = {
      dateType: date.dateType,
      dataType: currentDataType,
      startDay: date.startDay.replace(/-/g, ''),
      endDay: date.endDay.replace(/-/g, ''),
      subKdtId: context.subKdtId,
      hqKdtId,
      queryType: getQueryType(context.subKdtId),
      pageNumber: Number(page) || 1,
      sortBy: sortBy,
      sortType: sortType ? sortType.toUpperCase() : '',
    };

    if (data.startDay && data.endDay && data.dateType) {
      return Promise.resolve(data);
    } else {
      return Promise.reject('请选择时间');
    }
  }, [context.subKdtId, date, currentDataType]);

  const exportList = useCallback((state) => {
    getNewFetchParams(state).then(params => {
      exportAttendClassDetail(params)
        .then(data => {
          if (data) {
            Notify.success('导出报表成功');
            openExportRecord();
          } else {
            Notify.error('暂无数据，请重新筛选后导出');
          }
        })
        .catch(err => {
          Notify.error(err);
        });
    }).catch(err => {
      Notify.error(err);
    });
  }, [getNewFetchParams]);

  const openExportRecord = () => {
    window.open(`${_global.url.v4}/vis/stat/export/attendance#/export/13`);
  };

  const fetchList = useCallback<IListProps['onSubmit']>(state => {
    return new Promise((resolve, reject) => {
      getNewFetchParams(state).then(params => {
        const { dataType } = params;
        setDataType(dataType);
        findAttendClassDetailPage(params)
          .then(res => {
            const { content = [], pageable = {}, total = 0 } = res;
            const { pageNumber = 0, pageSize = 0 } = pageable;
            resolve({
              dataset: content,
              pageInfo: { page: pageNumber, pageSize, total },
            });
          }).catch(err => {
            Notify.error(err);
            reject();
          });
      }).catch(err => {
        Notify.error(err);
        reject();
      });
    });
  }, [getNewFetchParams]);

  useEffect(() => {
    listRef && listRef.current && listRef.current.action.refresh();
  }, [context.subKdtId]);

  const clsPrefix = 'attendance-list-container';

  return (
    <div className={clsPrefix}>
      <div className={`${clsPrefix}__header`}>上课明细</div>
      <List ref={listRef} onSubmit={fetchList} mode="none">
        <Filter
          config={filterConfig}
          renderActions={Actions}
        />

        <EasyGrid
          columns={columns}
          emptyLabel="还没有明细"
          rowKey="alias"
        />
      </List>
    </div>
  );
}

export default AttendanceList;
