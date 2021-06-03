import get from 'lodash/get';
import { format } from 'date-fns';
import { EasyList } from '@youzan/ebiz-components';
import React, { FC, useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { IListProps, IListContext } from '@youzan/ebiz-components/es/types/easy-list';

import useCampusQuery from '../../utils/use-campus-query';
import { getStatistic, getCourseRecordByStudentNo } from '../../../api/student-detail';
import getStudyRecordConfig, { IFilterFields, getStudyRecordColumns } from './get-configs';

// 自己独有的样式
import './index.scss';

interface IStudyRecordsProps { campusKdtId: number; studentId: string, updatingSignal: number }

const { Filter, EasyGrid, List } = EasyList;
const PAGE_SIZE = 10;
const INITIAL_FIELDS: IFilterFields = {
  title: '',
  rangeTime: ['', ''],
  pageSize: PAGE_SIZE,
};

const StudyRecords: FC<IStudyRecordsProps> = ({ campusKdtId, studentId, updatingSignal }) => {
  const listRef = useRef<IListContext|null>(null);
  const [statistic, setStatistic] = useState<Record<string, any>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const studyRecordsConfig = useMemo(() => getStudyRecordConfig(INITIAL_FIELDS), []);
  const passiveQueries = useCampusQuery({ studentId, kdtId: campusKdtId });

  const fetchData = useCallback<IListProps['onSubmit']>(
    query => {
      const { page } = query;
      const filter = filterCollector(query);
      return getCourseRecordByStudentNo({
        query: {
          ...passiveQueries,
          ...filter,
        } as any,
        pageRequest: {
          pageNumber: page,
          pageSize: PAGE_SIZE,
        },
      }).then(res => {
        const { content = [], total = 0 } = res || {};
        const pageInfo = { page, total };
        const dataset = content;
        return { pageInfo, dataset };
      });
    },
    [passiveQueries],
  );

  const fetchStatistic = useCallback(() => {
    getStatistic(passiveQueries as any).then(setStatistic);
  }, [passiveQueries]);

  useEffect(fetchStatistic, []);

  useEffect(() => {
    if (updatingSignal) {
      fetchStatistic();
      listRef.current && listRef.current.action.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingSignal]);

  return (
    <div className="student-detail__tab-panel">
      <div className="student-detail__filter-wrapper statistic">
        <label className="record-statistic">
          <span className="strong-des">{get(statistic, 'alreadyBuyRecord') || 0}</span>
          <span className="under-des">已购课程（门）</span>
        </label>
        <label className="record-statistic">
          <span className="strong-des">{get(statistic, 'alreadyLessonRecord') || 0}</span>
          <span className="under-des">上课次数（次）</span>
        </label>
        <label className="record-statistic">
          <span className="strong-des">{get(statistic, 'alreadyLessonTime') || 0}</span>
          <span className="under-des">学习时间（分）</span>
        </label>
      </div>
      <div className="student-detail__tab-panel">
        <List mode="none" ref={listRef} onSubmit={fetchData} defaultFilter={INITIAL_FIELDS}>
          <Filter config={studyRecordsConfig} />
          <EasyGrid rowKey="lessonNo" scroll={{ x: 1550 }} columns={getStudyRecordColumns()} />
        </List>
      </div>
    </div>
  );
};

export default StudyRecords;

function filterCollector(
  query: Record<string, any>,
): {
    startDate: string;
    endDate: string;
    title: string;
  } {
  return {
    startDate: format(get(query, 'rangeTime[0]', INITIAL_FIELDS.rangeTime[0]), 'YYYY-MM-DD 00:00:00'),
    endDate: format(get(query, 'rangeTime[1]', INITIAL_FIELDS.rangeTime[0]), 'YYYY-MM-DD 23:59:59'),
    title: query.title,
  };
}
