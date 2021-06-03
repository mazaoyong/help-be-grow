import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Notify } from 'zent';
import { format } from 'date-fns';
import { EduClassChangeDialog } from '@ability-center/assets';
import { getModel } from '@youzan/arthur-scheduler-react';
import {
  dropEmptyLikeValue,
  dropNullableTimeRange,
  dropSelectAllValue,
  queriesMarshall,
} from 'fns/format/queries-marshall';

import Filter from './components/filter';
import getStudentColumns from './util';
import { findSignUpReadInfo } from '../../../api';

import type { IFilter } from './types';

const timeRangeSplitKeyMap = {
  recentStudyRange: ['startRecentStudyTime', 'endRecentStudyTime'],
  applyDateRange: ['startRegisterTime', 'endRegisterTime'],
  validBegin: ['validityBeginMin', 'validityBeginMax'],
  validEnd: ['validityEndMin', 'validityEndMax'],
};
const ApplyList: React.FC = () => {
  const [filter, setFilter] = useState<IFilter>({});
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [showOperate, setShowOperate] = useState(true);

  const getList = useCallback(
    (currentPage?: number) => {
      setLoading(true);
      findSignUpReadInfo({
        pageNum: currentPage || pageInfo.current,
        pageSize: pageInfo.pageSize,
        ...filter,
      })
        .then(({ content, total }) => {
          setTotal(total);
          setStudentList(content);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [pageInfo, filter],
  );

  const onSearch = useCallback((filterQuery) => {
    const convertedQueries = queriesMarshall.queriesDropper(filterQuery || {}, [
      dropEmptyLikeValue,
      dropSelectAllValue(['targetKdtId', 'eduClassId', 'staff']),
      dropNullableTimeRange([
        'recentStudyRange',
        'applyDateRange',
        'validBegin',
        'validEnd',
        'remainTime',
      ]),
    ]);
    Object.entries(timeRangeSplitKeyMap).forEach(([key, timeRangeKey]) => {
      if (convertedQueries[key]) {
        const [timeStart, timeEnd] = convertedQueries[key];
        const [timeStartKey, timeEndKey] = timeRangeKey;
        timeStart && (convertedQueries[timeStartKey] = format(timeStart, 'YYYY-MM-DD 00:00:00'));
        timeEnd && (convertedQueries[timeEndKey] = format(timeEnd, 'YYYY-MM-DD 23:59:59'));
        delete convertedQueries[key];
      }
    });
    if (convertedQueries.staff) {
      convertedQueries.sellerId = convertedQueries.staff;
      delete convertedQueries.staff;
    }
    if (convertedQueries.remainTime) {
      const [minTimes, maxTimes] = convertedQueries.remainTime;
      minTimes && (convertedQueries.minCourseTime = minTimes * 100);
      maxTimes && (convertedQueries.maxCourseTime = maxTimes * 100);
      delete convertedQueries.remainTime;
    }
    setFilter(convertedQueries);
    setPageInfo(prev => {
      return {
        ...prev,
        current: 1
      };
    });
  }, []);

  const onTableChange = useCallback(({ current = 1 }) => {
    setPageInfo({
      current,
      pageSize: 10,
    });
  }, []);

  const changeEduClass = useCallback(
    (record) => {
      const { courseSellType, remainingValue, name, validity, id, userId, kdtId } = record;
      // 资产是按课时，课时<=0
      if (courseSellType === 1 && remainingValue <= 0) {
        Notify.error(`学员“${name}”课时已耗完，不能调班`);
        return;
      }
      // 资产是按课时、时段、自定义，课程到期日<当天
      if (
        [0, 1, 2].includes(courseSellType) &&
        validity !== '永久有效' &&
        new Date(validity).getTime() < Date.now()
      ) {
        Notify.error(`学员“${name}”课程到期了，不能调班`);
        return;
      }
      EduClassChangeDialog.open({
        defaultData: {
          kdtId,
          assetNo: id,
          studentId: userId,
        },
        callback: () => {
          getList(1);
        },
      });
    },
    [getList],
  );
  useEffect(() => {
    getList();
    const abilitys = getModel('adjustCourseAssert', 'courseAssert');
    setShowOperate(abilitys.available);
  }, [getList]);
  return (
    <>
      <Filter onSearch={onSearch} defaultValues={filter} />
      <Grid
        columns={getStudentColumns(changeEduClass, showOperate)}
        scroll={{
          x: 1100,
        }}
        datasets={studentList}
        loading={loading}
        onChange={onTableChange}
        pageInfo={{
          current: pageInfo.current,
          pageSize: pageInfo.pageSize,
          total,
        }}
        ellipsis={true}
      />
    </>
  );
};

export default ApplyList;
