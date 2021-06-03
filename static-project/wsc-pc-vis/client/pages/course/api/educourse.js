import { visAjax } from 'fns/new-ajax';

/**
 * 查询课程商品列表信息
 *
 * @export
 * @param {Object} payload
 * @returns
 */
export function getCourseList(payload) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', payload);
}

/**
 * 通过ID查询特定课程
 */
export function getEduCourseById(payload) {
  return visAjax('GET', '/edu/eduCourse/eduCourse.json', payload);
}

/**
 * 新建课程
 */
export function createEduCourse(payload) {
  return visAjax('POST', '/edu/eduCourse/eduCourse.json', payload);
}

/**
 * 更新课程
 */
export function updateEduCourse(payload) {
  return visAjax('PUT', '/edu/eduCourse/eduCourse.json', payload);
}

/**
 * 删除课程
 */
export function deleteEduCourse(payload) {
  return visAjax('DELETE', '/edu/eduCourse/eduCourse.json', payload);
}

/**
 * 查看课程重名
 */
export function checkCourseName(payload) {
  return visAjax('GET', '/edu/eduCourse/checkCourseName.json', payload);
}

/**
 * 通过ID查询特定课程——支持连锁
 */
export function getByIdV2(payload) {
  return visAjax('GET', '/edu/eduCourse/getByIdV2.json', payload);
}

/**
 * 检查校区是否可删除
 */
export function checkEduCourse(payload) {
  return visAjax('GET', '/edu/eduCourse/checkEduCourse.json', payload);
}

/**
 * 通过课程ID查询校区列表——支持连锁
 */
export function findPageByEduCourse(payload) {
  return visAjax('GET', '/edu/eduCourse/findPageByEduCourse.json', payload);
}

/**
 * 删除课程
 */
export function deleteEduCourseV2(payload) {
  return visAjax('POST', '/edu/eduCourse/deleteEduCourseV2.json', payload);
}
