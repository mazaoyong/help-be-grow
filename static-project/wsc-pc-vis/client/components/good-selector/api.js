import { visAjax } from 'fns/new-ajax';

// 查询知识列表
export function getGoodsList(data) {
  return visAjax('GET', '/goods-selector/goodslist.json', data);
}

// 查询分组列表
export function getGroupList(data) {
  return visAjax('GET', '/goods-selector/grouplist.json', data);
}
