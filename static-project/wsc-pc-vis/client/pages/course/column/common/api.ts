// 专栏相关接口
import { visAjax } from 'fns/new-ajax';
import { parseColumnDetail, parseColumnList } from './utils/column-detail-adaptor';

// const baseUrl = window._global.isSuperStore ? window._global.url.store : window._global.url.base;

/**
 * ### 专栏iron 迁移新接口 start ###
 */
const columnPrefix = '/course/column';

// 更新专栏请好友看状态
export function updateShareStatus(data) {
  return visAjax('POST', `${columnPrefix}/updateShareStatus.json`, data);
}

// 获取专栏详情
export function getByAlias(data) {
  return visAjax('GET', `${columnPrefix}/getByAlias.json`, data)
    .then(res => parseColumnDetail(res));
}

// 按照条件查询相关的专栏商品
export function findPageByCondition(data) {
  return visAjax('GET', `${columnPrefix}/findPageByCondition.json`, data, { cleanEmptyKey: true })
    .then(res => parseColumnList(res));
}

// 修改专栏更新状态
export function updateSerializedStatus(alias, isStop) {
  return visAjax('POST', `${columnPrefix}/updateSerializedStatus.json`, {
    alias, isStop,
  });
};

// 修改专栏是否上架状态
export function updateOnSaleStatus(alias, isOnSale) {
  return visAjax('POST', `${columnPrefix}/updateOnSaleStatus.json`, {
    alias, isOnSale,
  });
}

// 删除专栏商品
export function deleteColumn(data) {
  return visAjax('POST', `${columnPrefix}/deleteColumn.json`, data);
}
