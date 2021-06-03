import { visAjax } from 'fns/new-ajax';

/**
 * 查询教师列表
 */
export function queryTeacherListWithStatistic(payload) {
  return visAjax('GET', '/edu/teachers/queryTeacherListWithStatistic.json', payload);
}

/**
 * 导出教师列表
 */
export function exportTeacherListWithStatistic(payload) {
  return visAjax('POST', '/edu/teachers/exportTeacherListWithStatistic.json', payload);
}

/**
 * 查询教师课程列表
 */
export function queryCourseList(payload) {
  return visAjax('GET', '/edu/teachers/queryCourseList.json', payload);
}

/**
 * 导出教师课程列表
 */
export function exportCourseList(payload) {
  return visAjax('POST', '/edu/teachers/exportCourseList.json', payload);
}

/**
 * 查询课表/上课记录列表
 */
export function queryLessonList(payload) {
  return visAjax('GET', '/edu/teachers/queryLessonList.json', payload);
}

/**
 * 导出课表/上课记录列表
 */
export function exportLessonList(payload) {
  return visAjax('POST', '/edu/teachers/exportLessonList.json', payload);
}

/**
 * 查询教师信息
 */
export function getById(payload) {
  return visAjax('GET', '/edu/teachers/getById.json', payload);
}

// 获取课节看
export function getScheduleListAPI(data) {
  return visAjax('GET', '/edu/schedule/list.json', data);
}

// 查询上课记录统计数据。
export function queryTeacherLessonStatistics(data) {
  return visAjax('GET', '/edu/teachers/queryTeacherLessonStatistics.json', data);
}
