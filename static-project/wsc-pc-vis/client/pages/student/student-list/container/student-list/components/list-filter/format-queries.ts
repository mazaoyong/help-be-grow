import { IEduStudentAggregatePcV2ExportQuery } from 'definitions/api/owl/pc/StudentAggregateFacade/submitStudentExportTask';

const timeRangeReflectKeys: Record<string, string[]> = {
  dateRange: ['startDate', 'endDate'],
};
export function formatQueries(queries: Record<string, any>) {
  const formattedQueries: IEduStudentAggregatePcV2ExportQuery = {};
  if (Object.keys(queries).length) {
    Object.entries(queries).forEach(([key, value]) => {
      switch (key) {
        case 'dateRange':
          if (Array.isArray(value) && value.length) {
            const [startKey, endKey] = timeRangeReflectKeys[key];
            const [startTime, endTime] = value;
            startTime && (formattedQueries[startKey] = startTime + ' 00:00:00');
            endTime && (formattedQueries[endKey] = endTime + ' 23:59:59');
          }
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
