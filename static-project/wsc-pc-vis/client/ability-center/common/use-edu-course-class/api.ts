import { visAjax } from 'fns/new-ajax';

// 查询指定课程关联班级列表
export function getClassList(payload) {
  return visAjax('GET', '/edu/course/findEduClassByCondition.json', payload);
}