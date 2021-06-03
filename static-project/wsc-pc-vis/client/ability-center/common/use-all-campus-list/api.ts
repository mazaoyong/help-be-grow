import { visAjax } from 'fns/new-ajax';

/**
 * 查询校区（分店）列表——不分页
 */

export function findListAllCampus() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json');
}
