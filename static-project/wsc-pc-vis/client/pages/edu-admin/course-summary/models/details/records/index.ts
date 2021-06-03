import React from 'react';
import { Notify } from 'zent';

// 复用签到历史页面的列表接口和导出接口
import {
  getSignInRecords,
  exportSigninRecord,
  signinListQueryFormatter,
} from '@ability-center/edu-admin/signin';

import { getFilterConfig } from './filter-config';
import { getCollapseConfig } from './collapse-config';
import { getGridColumnsConfig } from './grid-config';

import type { UseRecordsDetailModel, IUseRecordsDetailModelRes } from './types';
import { LoadingSection } from '../manual-consume/types';
import { getRecordsSummary } from '../../../domain/apis/detail';

const defaultSummaryData: IUseRecordsDetailModelRes['recordsSummaryData'] = {
  consumeNum: 0,
  consumeTuition: 0,
};
const defaultLoadingState: Record<LoadingSection, boolean> = { summaryInfo: false };
type ResAlias = IUseRecordsDetailModelRes;
export const useRecordsDetailModel: UseRecordsDetailModel = (params) => {
  const { userId, assetNo } = params;
  const [loadingCollection, updateLoadingState] = React.useState(defaultLoadingState);
  const [summaryData, setSummaryData] = React.useState(defaultSummaryData);
  const filterConfig = React.useMemo(() => getFilterConfig(), []);
  const gridConfig = React.useMemo(() => getGridColumnsConfig(), []);
  const collapseConfig = React.useMemo(() => getCollapseConfig(), []);

  const getSummaryData = React.useCallback((queries: any) => {
    updateLoadingState((prev) => ({
      ...prev,
      summaryInfo: true,
    }));
    return getRecordsSummary(queries)
      .then(setSummaryData)
      .catch((err) => {
        Notify.error(err && err.message);
      })
      .finally(() => {
        updateLoadingState((prev) => ({
          ...prev,
          summaryInfo: false,
        }));
      });
  }, []);

  const fetchList = React.useCallback<ResAlias['fetchList']>(
    (query) => {
      const formattedQueries = {
        // 固定参数
        sellCourseType: 1,
        /** 防止kdtId覆盖queries.kdtId */
        kdtId: query.kdtId || _global.kdtId,
        ...signinListQueryFormatter({
          ...query,
          userId,
          assetNo,
        }),
        pageNumber: query.page,
        pageSize: query.pageSize || 20,
      };
      getSummaryData(formattedQueries);
      return getSignInRecords(formattedQueries).then(({ content, total, pageable = {} }) => {
        return {
          dataset: content,
          pageInfo: {
            total,
            page: pageable.pageNumber || 1,
          },
        };
      });
    },
    [assetNo, getSummaryData, userId],
  );

  const exportRecordsDetail = React.useCallback<ResAlias['exportRecordsDetail']>(
    (filterRef) => {
      const filterQueries = {
        ...filterRef.getCurrentValues(),
        userId,
        assetNo,
      };
      const formattedQueries = signinListQueryFormatter(filterQueries);
      const formattedQueryKeys = Object.keys(formattedQueries);
      if (!formattedQueryKeys.includes('startTime') || !formattedQueryKeys.includes('endTime')) {
        // 强制展开折叠选项
        filterRef.toggleState('expand');
        return Promise.reject(new Error('请选择签到时间'));
      }

      return exportSigninRecord({ query: formattedQueries });
    },
    [assetNo, userId],
  );

  return {
    // data or config
    filterConfig,
    collapseConfig,
    gridConfig,
    loadingCollection,
    recordsSummaryData: summaryData,
    // handlers
    fetchList,
    exportRecordsDetail,
  };
};
