import { visAjax } from 'fns/new-ajax';

// 获取分校详情
export function getCompusAPI(data) {
  return visAjax('GET', '/commom/shop/chain/findListByKdtIds.json', data);
}
