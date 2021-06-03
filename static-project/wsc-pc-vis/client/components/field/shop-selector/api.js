import { visAjax } from 'fns/new-ajax';

/**
 * 检查校区是否可删除
 */
export function checkEduCourse(payload) {
  return visAjax('GET', '/edu/eduCourse/checkEduCourse.json', payload);
}
