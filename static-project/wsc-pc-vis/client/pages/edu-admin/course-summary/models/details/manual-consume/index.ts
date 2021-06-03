import React from 'react';
import { Notify } from 'zent';

import { getFilterConfig } from './filter-config';
import { getGridConfig } from './grid-config';
import { manualConsumeQueriesFormat } from '../../../utils';
import {
  getManualConsumeRecords,
  exportManualConsumeRecords,
  getManualConsumeSummary,
} from '../../../domain/apis/detail';
import { IUseManualConsumeModelRes, LoadingSection, UseManualConsumeModelType } from './types';

const defaultSummaryData: IUseManualConsumeModelRes['manualConsumeSummaryData'] = {
  subNum: 0,
  subTuition: 0,
};
const defaultLoadingState: Record<LoadingSection, boolean> = { summaryInfo: false };
export const useManualConsumeModel: UseManualConsumeModelType = (params) => {
  const { studentId, assetNo } = params;
  const [loadingCollection, updateLoadingState] = React.useState(defaultLoadingState);
  const [summaryData, setSummaryData] = React.useState(defaultSummaryData);
  const filterConfig = React.useMemo(() => getFilterConfig({}), []);
  const gridConfig = React.useMemo(() => getGridConfig({}), []);

  const getSummaryData = React.useCallback((queries: any) => {
    updateLoadingState((prev) => ({
      ...prev,
      summaryInfo: true,
    }));
    return getManualConsumeSummary(queries)
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

  const fetchList = React.useCallback<IUseManualConsumeModelRes['fetchList']>(
    (query) => {
      const { page, pageSize, ...restQueries } = query;
      const formattedQueries = manualConsumeQueriesFormat({
        ...restQueries,
        studentId,
        assetNo,
      });
      getSummaryData(formattedQueries);
      return getManualConsumeRecords(formattedQueries, { pageNumber: page, pageSize }).then(
        (data) => {
          return {
            dataset: data.content,
            pageInfo: {
              total: data.total,
              page: data.pageable.pageNumber,
              pageSize: data.pageable.pageSize,
            },
          };
        },
      );
    },
    [assetNo, getSummaryData, studentId],
  );

  const exportRecordsDetail = React.useCallback<IUseManualConsumeModelRes['exportRecordsDetail']>(
    (filter) => {
      try {
        const queries = {
          ...filter.getCurrentValues(),
          studentId,
          assetNo,
        };
        const formattedQueries = manualConsumeQueriesFormat(queries);
        return exportManualConsumeRecords(formattedQueries);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [assetNo, studentId],
  );

  return {
    filterConfig,
    gridConfig,
    manualConsumeSummaryData: summaryData,
    loadingCollection,
    // methods
    fetchList,
    exportRecordsDetail,
  };
};
