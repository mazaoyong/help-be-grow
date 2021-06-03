import { visAjax } from 'fns/new-ajax';

/**
 * 查询校区（分店）列表——分页
 */
export function findPageAllCampus(payload) {
  return visAjax('GET', '/commom/shop/findPageAllCampus.json', payload);
}

/**
 * 查询校区（分店）列表——不分页
 */
export function findListAllCampus(payload) {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', payload);
}
