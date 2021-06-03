import { visAjax } from 'fns/new-ajax';

/**
 * 通过ID查询特定课程——支持连锁
 */

export function getDetail(payload) {
  return visAjax('GET', '/edu/eduCourse/getByIdV2.json', payload);
}