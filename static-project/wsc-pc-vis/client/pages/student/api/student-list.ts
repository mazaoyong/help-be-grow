import { visAjax } from 'fns/new-ajax';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import startOfToday from 'date-fns/start_of_today';

import type { IEduStudentAggregatePcV2ExportQuery } from 'definitions/api/owl/pc/StudentAggregateFacade/submitStudentExportTask';

// 查询7天内生日的学员
export function getStudentListByBirthdayJson(data) {
  return visAjax(
    'GET',
    '/edu/getStudentListByBirthday.json',
    Object.assign({}, data, {
      query: {
        commonTimeBucketQuery: {
          startDay: format(startOfToday(), 'YYYY-MM-DD HH:mm:ss'),
          endDay: format(addDays(startOfToday(), 6), 'YYYY-MM-DD HH:mm:ss'),
        },
      },
    }),
  );
}

// 查询课时即将用尽的学员
export function getStudentListByRemainingHourNotEnoughJson(data) {
  return visAjax(
    'GET',
    '/edu/getStudentListByRemainingHourNotEnough.json',
    Object.assign({}, data, {
      query: {
        remainingHour: 5,
      },
    }),
  );
}

// 查询课时即将到期的学员
export function getStudentListByEndTimeNotEnoughJson(data) {
  return visAjax(
    'GET',
    '/edu/getStudentListByEndTimeNotEnough.json',
    Object.assign({}, data, {
      query: {
        validDays: 14,
      },
    }),
  );
}

// 查询7日内未上课的学员
export function getStudentListByUnusedAssetJson(data) {
  return visAjax(
    'GET',
    '/edu/getStudentListByUnusedAsset.json',
    Object.assign({}, data, {
      query: {
        commonTimeBucketQuery: {
          startDay: format(subDays(startOfToday(), 6), 'YYYY-MM-DD HH:mm:ss'),
          endDay: format(startOfToday(), 'YYYY-MM-DD HH:mm:ss'),
        },
      },
    }),
  );
}

// 获取学员列表页统计信息
interface IGetStudentListStatisticQuery {
  kdtId?: number | string;
}
export function getStudentListStatistic(query: IGetStudentListStatisticQuery) {
  return visAjax('GET', '/edu/student/getStudentListPageStatistics.json', query);
}

interface IFindStudentsQuery {
  query: {
    name: string;
    mobile: string;
    targetKdtId?: number;
  };
  pageRequest: any;
}
export function findStudents(params: IFindStudentsQuery) {
  return visAjax('GET', '/edu/student/findStudents.json', params);
}

export function exportStudentList(query: IEduStudentAggregatePcV2ExportQuery) {
  return visAjax('POST', '/student/student-list/submitStudentExportTask.json', { query });
}
