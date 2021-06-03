import {
  queriesMarshall,
  dropSelectAllValue,
  dropEmptyLikeValue,
  dropNullableTimeRange,
  flatEbizSelectValue,
} from 'fns/format/queries-marshall';
import { isInSixMonths } from './get-six-months-range';
import type { IStudentSignSummaryQuery } from 'definitions/api/owl/pc/SignSummaryFacade/findStudentSignSummaryInfo';
import type { IAssetSignSummaryQuery } from 'definitions/api/owl/pc/SignSummaryFacade/findAssetSignSummaryInfo';
import type { IEduAssetOperationQuery } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';

const timeRangeFieldKeys = ['lessonTime', 'signinTime', 'deductionTime', 'registerTime'];
const selectCheckList = [
  'classId',
  'courseStatus',
  'eduCourseId',
  'signInStatus',
  'studentId',
  'teacherId',
  'userId',
];
export function studentQueriesFormat(query: any): IStudentSignSummaryQuery {
  const noEmptyQueries = queriesMarshall.queriesDropper(query, [
    dropEmptyLikeValue,
    dropNullableTimeRange(timeRangeFieldKeys),
    dropSelectAllValue(selectCheckList),
  ]);

  if (Object.keys(noEmptyQueries).length) {
    let formattedQueries = queriesMarshall.queriesAdaptor(noEmptyQueries, [
      flatEbizSelectValue(['eduCourseId']),
    ]);
    Object.entries(formattedQueries).forEach(([key, value]) => {
      const timeRangeMap = timeRangeFormatter(key, value);
      if (timeRangeMap) {
        delete formattedQueries[key];
        formattedQueries = {
          ...formattedQueries,
          ...timeRangeMap,
        };
      }
    });
    return formattedQueries;
  }
  return {};
}

export function applyListQueriesFormat(query: any): IAssetSignSummaryQuery {
  // 暂时格式化方式是一致的，都只针对时间进行特殊处理，所以逻辑混用
  const baseFormattedQueries = studentQueriesFormat(query);
  return baseFormattedQueries;
}

export function manualConsumeQueriesFormat(query: any): IEduAssetOperationQuery {
  const noEmptyQueries = queriesMarshall.queriesDropper(query, [
    dropEmptyLikeValue,
    dropNullableTimeRange(timeRangeFieldKeys),
  ]);
  // 如果不存在一下关键参数，报错！
  if (!(noEmptyQueries.studentId || noEmptyQueries.userId || noEmptyQueries.assetNo)) {
    throw new Error('列表请求不合法，缺少必要参数');
  }
  let formattedQueries = { ...noEmptyQueries };
  if (Object.keys(noEmptyQueries).length) {
    Object.entries(noEmptyQueries).forEach(([key, value]) => {
      const timeRangeMap = timeRangeFormatter(key, value);
      if (timeRangeMap) {
        delete formattedQueries[key];
        formattedQueries = {
          ...formattedQueries,
          ...timeRangeMap,
        };
      }
    });
  }
  return formattedQueries as IEduAssetOperationQuery;
}

export function getDetailRedirectQueries(query: Record<string, any>) {
  return queriesMarshall.queriesDropper(query, [
    dropEmptyLikeValue,
    dropSelectAllValue(selectCheckList),
  ]);
}

const timeRangeReflect: Record<string, [string, string]> = {
  lessonTime: ['lessonStartTime', 'lessonEndTime'],
  signinTime: ['signInStartTime', 'signInEndTime'],
  deductionTime: ['deductionStartTime', 'deductionEndTime'],
  registerTime: ['registerStartTime', 'registerEndTime'],
};
function timeRangeFormatter(key: string, value: any) {
  switch (key) {
    case 'lessonTime':
      if (!isInSixMonths(value)) {
        throw new Error('变更时间范围不能超过180天');
      }
    // eslint-disable-next-line no-fallthrough
    case 'signinTime':
    case 'registerTime':
    case 'deductionTime':
      const [startTime, endTime] = value;
      if (!(startTime && endTime)) throw new Error('请选择完整的开始时间和结束时间');
      const [startTimeKey, endTimeKey] = timeRangeReflect[key];
      return {
        [startTimeKey]: startTime,
        [endTimeKey]: endTime,
      };
    default:
      return null;
  }
}
