import { visAjax } from 'fns/new-ajax';
import { getCourseSchedule } from '@ability-center/schedule';
import { getCourseRecord } from '@ability-center/edu-course';

export interface IPageRequest {
  pageNumber: number;
  pageSize: number;
  sort?: {
    orders: Array<{ property: string; direction: 'DESC' | 'ASC' }>;
  };
}

interface IStudentInfoQuery {
  identityNo?: string;
  studentId?: any;
  clueId?: any;
}
export function getStudentInfoByNo(data: IStudentInfoQuery) {
  return visAjax('GET', '/edu/student/getInfoById.json', data);
}

interface IGetInfoByStudentId {
  studentId: string | number;
}
export function getContractListByStudentId(data: IGetInfoByStudentId) {
  return visAjax('GET', '/edu/student/getByStudentId.json', data);
}

// 用于获取学员编号和客户信息
// eslint-disable-next-line camelcase
export function getStudentNoAndCustomInfo_OLD(data: IGetInfoByStudentId) {
  return visAjax('GET', '/edu/getStudentInfoById.json', data);
}

// 获取角色信息
export function getRoleInfo() {
  return visAjax('GET', '/edu/clue/findMyRole.json');
}

// 学员详情页tabs多校区的支持
interface IStudentAPIBaseStruct {
  studentId: string | number;
  kdtId?: number;
}
// 根据学员id获取学员课表
interface IGetTabData {
  query: {
    title?: string;
    startDate: string;
    endDate: string;
  } & IStudentAPIBaseStruct;
  pageRequest: IPageRequest;
}
export function getCourseScheduleByStudentNo<Response = any>(data: IGetTabData) {
  return getCourseSchedule<IGetTabData, Response>(data);
}

// 获取统计信息
export function getStatistic(data: IStudentAPIBaseStruct) {
  return visAjax('GET', '/edu/student/statistics.json', data);
}

export function getCourseRecordByStudentNo<Response = any>(data: IGetTabData) {
  return getCourseRecord<IGetTabData, Response>(data);
}

// 根据学员id和客户id删除学员
interface IDeleteStudent {
  studentId: string | number;
  customerId: string | number;
  targetKdtId: string | number;
}
export function deleteStudentById(data: IDeleteStudent) {
  return visAjax('POST', '/edu/student/delete.json', data);
}

interface CustomerItemType extends Record<string, any> {
  attributeKey?: string;
  attributeId: number;
  value: any;
}
interface IStudentData {
  attributeItems: CustomerItemType[];
  clueId?: string | number;
  studentId?: string | number;
  identityNo?: string;
}
export function saveAttribute(data: IStudentData) {
  return visAjax('POST', '/edu/student/saveAttribute.json', data);
}

// 根据学员id获取学员课程列表
export function getStudentSigndCourses(data) {
  return visAjax('GET', '/edu/student/findPageByQueryWithWrapCourse.json', data);
}

// 修改有效期
export function modifyAvailableTime(data) {
  return visAjax('POST', '/edu/student/modifyAvailableTime.json', data);
}

// 修改课时检查
export function checkCourseTime(data) {
  return visAjax('GET', '/edu/student/checkCourseTime.json', data);
}

// 修改课时
export function updateCourseTime(data) {
  return visAjax('POST', '/edu/student/updateCourseTime.json', data);
}

// 体验课试听
export function findStudentLessonsAPI(data) {
  return visAjax('GET', '/edu/appointment/findStudentLessonsByIdentity.json', data);
}

// 检测是否是潜在学员
interface IPotentialStudentQuery {
  studentId: number | string;
}
export function checkIsPotentialStudent(data: IPotentialStudentQuery) {
  return visAjax<{
    clueId: number;
    potentialStudent: boolean;
  }>('GET', '/edu/student/checkIsPotential.json', data);
}

// 修改有效期时查询学员资产信息
export function getStuAssetInfo(data) {
  return visAjax('POST', '/student/assets/student-course-assets-change/getStuAssetInfo.json', data);
}
