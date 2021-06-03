import React from 'react';
import qs from 'qs';
import { format } from 'date-fns';
import {
  applyListQueriesFormat,
  getDetailRedirectQueries,
} from 'pages/edu-admin/course-summary/utils';
import {
  exportAssetList,
  getAssetsCourseSummaryList,
} from 'pages/edu-admin/course-summary/domain/apis/dimensions';
import type { IApplyListSummaryModel, IApplyListSummaryModelParams } from './types';

import { timeRange } from '../../../utils/get-six-months-range';
import { getFilterConfig } from './filter-config';
import { getCollapseConfig } from './filter-collapse-config';
import { getGridConfig } from './grid-config';

const defaultFilter = {
  lessonTime: timeRange.map((t) => format(t, 'YYYY-MM-DD')),
};
export const useApplyListSummaryModel = (
  props: any,
  _params?: IApplyListSummaryModelParams,
): IApplyListSummaryModel => {
  const { router } = props;
  const [tempFilter, setTempFilter] = React.useState({});
  const filterConfig = React.useMemo(() => getFilterConfig({}), []);
  const filterCollapseConfig = React.useMemo(() => getCollapseConfig({}), []);
  const redirectToDetail = React.useCallback(
    (assetNo: string) => {
      router.push(`detail/course/${assetNo}?${qs.stringify(tempFilter)}`);
    },
    [router, tempFilter],
  );
  const gridConfig = React.useMemo(() => getGridConfig({ redirectToDetail }), [redirectToDetail]);

  const fetchApplyListSummary = React.useCallback<IApplyListSummaryModel['fetchApplyListSummary']>(
    (query) => {
      const { page, pageSize = 20, ...restQueries } = query;
      const formattedQueries = applyListQueriesFormat(restQueries);
      // 不使用转换后的数据，而是使用元数据，保证后续步骤中字段能够对应即可
      setTempFilter(getDetailRedirectQueries(restQueries));
      return getAssetsCourseSummaryList(formattedQueries, {
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
    },
    [],
  );

  const handleExportApplyList = React.useCallback<IApplyListSummaryModel['exportApplyList']>(
    (filter) => {
      try {
        const formattedQueries = applyListQueriesFormat(filter.getCurrentValues());
        return exportAssetList(formattedQueries);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [],
  );

  return {
    filterConfig,
    filterCollapseConfig,
    gridConfig,
    defaultFilter,
    // methods
    fetchApplyListSummary,
    exportApplyList: handleExportApplyList,
  };
};
