import React, { FC, useMemo, useCallback, useRef, useEffect } from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { addDays, format } from 'date-fns';

import { getCourseScheduleByStudentNo } from '../../../api/student-detail';
import useCampusQuery from '../../utils/use-campus-query';

import getClassScheduleConfig, { IFilterFields, getClassScheduleColumns } from './get-configs';
import { IListProps, IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import get from 'lodash/get';

const { Filter, EasyGrid, List } = EasyList;
const PAGE_SIZE = 10;
const now = new Date().getTime();
const INITIAL_FIELDS: IFilterFields = {
  title: '',
  rangeTime: [now, addDays(now, 30).getTime()],
  pageSize: PAGE_SIZE,
};

const ClassSchedule: FC<{ campusKdtId: number; studentId: string; updatingSignal: number }> = ({
  campusKdtId,
  studentId,
  updatingSignal,
}) => {
  const listRef = useRef<IListContext|null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const classScheduleConfig = useMemo(() => getClassScheduleConfig(INITIAL_FIELDS), []);
  const passiveQueries = useCampusQuery({ studentId, kdtId: campusKdtId });

  const fetchData = useCallback<IListProps['onSubmit']>(
    (query) => {
      const { page } = query;
      const filter = filterCollector(query);
      return getCourseScheduleByStudentNo({
        query: {
          ...passiveQueries,
          ...filter,
        } as any,
        pageRequest: {
          pageNumber: page,
          pageSize: PAGE_SIZE,
        },
      }).then((res) => {
        const { content = [], total = 0 } = res || {};
        const pageInfo = { page, total };
        const dataset = content;
        return { pageInfo, dataset };
      });
    },
    [passiveQueries],
  );

  const handleForceUpdate = useCallback(() => {
    if (listRef.current) {
      listRef.current.action.refresh();
    }
  }, []);

  useEffect(() => {
    if (updatingSignal) {
      handleForceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingSignal]);

  return (
    <div className="student-detail__tab-panel">
      <List mode="none" ref={listRef} onSubmit={fetchData} defaultFilter={INITIAL_FIELDS}>
        <Filter config={classScheduleConfig} />
        <EasyGrid
          rowKey="lessonNo"
          scroll={{ x: 1200 }}
          columns={getClassScheduleColumns({
            state: { handleUpdate: handleForceUpdate },
          })}
        />
      </List>
    </div>
  );
};

export default ClassSchedule;

function filterCollector(
  query: Record<string, any>,
): {
    startDate: string;
    endDate: string;
    title: string;
  } {
  return {
    startDate: format(
      get(query, 'rangeTime[0]', INITIAL_FIELDS.rangeTime[0]),
      'YYYY-MM-DD 00:00:00',
    ),
    endDate: format(get(query, 'rangeTime[1]', INITIAL_FIELDS.rangeTime[0]), 'YYYY-MM-DD 23:59:59'),
    title: query.title,
  };
}
