import { visAjax } from 'fns/new-ajax';

/* 查询课程商品列表信息
*
* @export
* @param {Object} payload
* @returns
*/
export function getCourseList(payload) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', payload);
};
