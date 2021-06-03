import type { ISignUpReadExportQuery } from 'definitions/api/owl/pc/StudentFacade/submitSignUpReadExportTask';

const timeRangeReflect: Record<string, (keyof ISignUpReadExportQuery)[]> = {
  validBegin: ['validityBeginMin', 'validityBeginMax'],
  validEnd: ['validityEndMin', 'validityEndMax'],
  applyDateRange: ['startRegisterTime', 'endRegisterTime'],
  recentStudyRange: ['startRecentStudyTime', 'endRecentStudyTime'],
};
export function formatQueries(queries: Record<string, any>) {
  const formattedQueries: ISignUpReadExportQuery = {};

  if (Object.keys(queries).length) {
    Object.entries(queries).forEach(([key, value]) => {
      switch (key) {
        case 'remainTime':
          const [minRemainTimes, maxRemainTimes] = value;
          formattedQueries.maxCourseTime = maxRemainTimes * 100;
          formattedQueries.minCourseTime = minRemainTimes * 100;
          break;
        case 'validBegin':
        case 'validEnd':
        case 'applyDateRange':
        case 'recentStudyRange':
          const [startKey, endKey] = timeRangeReflect[key];
          const [startTime, endTime] = value;
          formattedQueries[startKey] = startTime;
          formattedQueries[endKey] = endTime;
          break;
        default:
          formattedQueries[key] = value;
          break;
      }
    });
    return formattedQueries;
  }
  return queries;
}
