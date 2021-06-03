import { visAjax } from 'fns/new-ajax';

export function getSkuInfo(data) {
  return visAjax('GET', '/goods-selector/goodInfo.json', data);
}
