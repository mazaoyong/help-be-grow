import { visAjax } from 'fns/new-ajax';

// 查询店铺下学员v2
export function findPageByQueryV2(data) {
  return visAjax('GET', '/edu/student/findPageByQueryV2.json', data);
};
