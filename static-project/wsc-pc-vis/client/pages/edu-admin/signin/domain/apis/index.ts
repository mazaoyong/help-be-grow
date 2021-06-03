import { visAjax } from 'fns/new-ajax';

// 这边老接口自己铺平了入参，所以需要自己定义
interface IRequiredSignInRecordsParams {
  kdtId: number;
  pageNumber: number;
  pageSize: number;
}
interface IGetSignInRecordsParams {
  /** time */
  startTime: string;
  endTime: string;
  teacherId: number;
  classId: number;
  addressId: number;
  userId: number;
  eduCourseId: number;
  signInStatus: number;
  lessonName: number;
  /** 上课时间 */
  lessonStartTime: string;
  lessonEndTime: string;
}
export function getSignInRecords(
  params: Partial<IGetSignInRecordsParams> & IRequiredSignInRecordsParams,
) {
  return visAjax('GET', '/edu/signin/records.json', params);
}

export function exportSigninRecord(params) {
  return visAjax<boolean>('POST', '/edu/schedule/detail/exportSignInRecords.json', params);
}

interface IGetStudentSignHistory {
  query: {
    userId?: number;
    kdtId?: string;
    studentLessonNo: number;
  };
  pageRequest: any;
}
export function getSignInRecordHistory(params: IGetStudentSignHistory) {
  return visAjax('GET', '/edu/signin/getSignInRecordHistory.json', params);
}

export function getSignInListSummary(query: Record<string, any>) {
  return visAjax('GET', '/edu/signin/getSignInListSummary.json', query);
}
