import { visAjax } from 'fns/new-ajax';

// 获取连锁总部下面所有的子店铺
export function findListAllCampusAPI() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', {});
}
