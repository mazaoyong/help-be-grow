import React from 'react';
import qs from 'qs';
import { format } from 'date-fns';
import {
  studentQueriesFormat,
  getDetailRedirectQueries,
} from 'pages/edu-admin/course-summary/utils/index';
import {
  exportStudentList,
  getStudentCourseSummaryList,
} from 'pages/edu-admin/course-summary/domain/apis/dimensions';
import type { IStudentSummaryModel, IStudentSummaryModelParams } from './types';

import { timeRange } from '../../../utils/get-six-months-range';
import { getFilterConfig } from './filter-config';
import { getGridConfig } from './grid-config';

const defaultFilter = {
  lessonTime: timeRange.map((t) => format(t, 'YYYY-MM-DD')),
};
export const useStudentSummaryModel = (
  props: any,
  _params?: IStudentSummaryModelParams,
): IStudentSummaryModel => {
  const { router } = props;
  const [tempFilter, setTempFilter] = React.useState({});
  const filterConfig = React.useMemo(() => getFilterConfig({}), []);
  const redirectToDetail = React.useCallback(
    (studentId: number) => {
      router.push(`detail/student/${studentId}?${qs.stringify(tempFilter)}`);
    },
    [router, tempFilter],
  );
  const gridConfig = React.useMemo(() => getGridConfig({ redirectToDetail }), [redirectToDetail]);

  const fetchStudentSummaryList = React.useCallback<
  IStudentSummaryModel['fetchStudentSummaryList']
  >((query) => {
    const { page, pageSize = 20, ...restQueries } = query;
    const formattedQueries = studentQueriesFormat(restQueries);
    // 不使用转换后的数据，而是使用元数据，保证后续步骤中字段能够对应即可
    setTempFilter(getDetailRedirectQueries(restQueries));
    return getStudentCourseSummaryList(formattedQueries, {
      pageNumber: page,
      pageSize,
    }).then((data) => {
      const { content, pageable, total } = data;
      return {
        dataset: content,
        pageInfo: {
          total,
          page: pageable.pageNumber,
        },
      };
    });
  }, []);

  const handleExportStudent = React.useCallback<IStudentSummaryModel['exportStudentList']>(
    (filter) => {
      try {
        const formattedQueries = studentQueriesFormat(filter.getCurrentValues());
        return exportStudentList(formattedQueries);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [],
  );

  return {
    // configs
    filterConfig,
    gridConfig,
    // data
    defaultFilter,
    // methods
    fetchStudentSummaryList,
    exportStudentList: handleExportStudent,
  };
};
