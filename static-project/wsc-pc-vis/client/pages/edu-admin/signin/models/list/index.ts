import React from 'react';

import { getSignInRecords, exportSigninRecord } from '../../domain/apis';

import { getFilterConfig } from './filter-config';
import { getCollapseConfig } from './collapse-config';
import { getGridColumnsConfig } from './grid-config';

import type { UseSigninListModel, IUseSigninListModelRes } from './types';
import { signinListQueryFormatter } from '../../utils/index';

type ResAlias = IUseSigninListModelRes;
const useSigninListModel: UseSigninListModel = () => {
  const filterConfig = React.useMemo(() => getFilterConfig(), []);
  const gridConfig = React.useMemo(() => getGridColumnsConfig(), []);
  const collapseConfig = React.useMemo(() => getCollapseConfig(), []);

  const fetchList = React.useCallback<ResAlias['fetchList']>((query) => {
    return getSignInRecords({
      /** 防止kdtId覆盖queries.kdtId */
      kdtId: query.kdtId || _global.kdtId,
      ...signinListQueryFormatter(query),
      pageNumber: query.page,
      pageSize: query.pageSize || 20,
    }).then(({ content, total, pageable = {} }) => {
      return {
        dataset: content,
        pageInfo: {
          total,
          page: pageable.pageNumber || 1,
        },
      };
    });
  }, []);

  const handleExportSigninRecords = React.useCallback<ResAlias['handleExportSigninRecords']>(
    (filterRef) => {
      try {
        const filterQueries = filterRef.getCurrentValues();
        const formattedQueries = signinListQueryFormatter(filterQueries);
        // const formattedQueryKeys = Object.keys(formattedQueries);
        const hasSigninTime = formattedQueries['startTime'] && formattedQueries['endTime'];
        const hasLessonTime = formattedQueries['lessonStartTime'] && formattedQueries['lessonEndTime'];

        if (!hasSigninTime && !hasLessonTime) {
          // 强制展开折叠选项
          filterRef.toggleState('expand');
          throw new Error('请选择上课时间或签到时间');
        }

        return exportSigninRecord({ query: formattedQueries });
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [],
  );

  return {
    // data or config
    filterConfig,
    collapseConfig,
    gridConfig,
    // handlers
    fetchList,
    handleExportSigninRecords,
  };
};

export default useSigninListModel;
