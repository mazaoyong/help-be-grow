import { visAjax } from 'fns/new-ajax';

export function getStudentBySchedule(params) {
  return visAjax('GET', '/edu/reserve/studentBySchedule.json', params);
}

export function getCourseList(params) {
  return visAjax('GET', '/edu/schedule/detail/student.json', params);
}

export function createScheduletudent(data) {
  return visAjax('POST', '/edu/schedule/detail/student.json', data);
}

export function getScheduleStudents(params) {
  return visAjax('GET', '/edu/schedule/detail/students.json', params);
}

export function getScheduleProfile(params) {
  return visAjax('GET', '/edu/schedule/detail/profile.json', params);
}

export function getScheduleStatistic(data) {
  return visAjax('GET', '/edu/schedule/detail/statistic.json', data);
}

export function getEduConfig() {
  return visAjax('GET', '/edu/settings.json');
}

export function getExcel(params) {
  return visAjax('GET', '/edu/schedule/detail/excel.json', params);
}

export function removeStudent(params) {
  return visAjax('DELETE', '/edu/schedule/detail/removeStudent.json', params);
}

export function modifyStatus(params) {
  return visAjax('PUT', '/edu/schedule/detail/modifyStatus.json', params);
}

/**
 * @param {import('definitions/api/owl/pc/StudentLessonFacade/batchCancelV2').IStudentLessonBatchCancelCommand} params
 * @return {Promise<import('definitions/api/owl/pc/StudentLessonFacade/batchCancelV2').IStudentLessonBatchCancelResult>}
 */
export function batchRemoveStudent(params) {
  return visAjax('POST', '/edu-admin/schedule/batchRemoveStudent.json', params);
}
