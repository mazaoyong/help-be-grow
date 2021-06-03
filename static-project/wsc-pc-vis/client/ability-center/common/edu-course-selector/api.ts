import { visAjax } from 'fns/new-ajax';

export function getCourseList(payload) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', payload);
}