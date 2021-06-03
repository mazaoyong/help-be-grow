// 买赠相关接口
import request from 'fns/pct-ajax';
import ajax from 'zan-pc-ajax';
import { visAjax } from 'fns/new-ajax';

const isSuperStore = _global.isSuperStore;
const BASE_URL = `${isSuperStore ? _global.url.store : _global.url.base}/v4`;

// 获取优惠券的列表
export function getCouponList({ keyword, pageNo, pageSize }) {
  return ajax({
    method: 'get',
    url: `${BASE_URL}/ump/common/api/coupons`,
    data: {
      keyword,
      pageNo,
      pageSize,
    },
  });
}

// 查询赠品列表
export function getPresentList(data) {
  return request('GET', '/freebie/findPage.json', data);
}

// 查询买赠列表
export function getFreebieLists(data) {
  return request('GET', '/freebie/lists.json', data);
}

// 获取参加活动的列表
export function getSelectedGoods(itemIds) {
  return request('GET', '/freebie/knowledgeByAlias.json', {
    itemIds: itemIds.join(','),
  });
}

// 创建买赠活动
export function createFreebieActive(data) {
  return request('POST', '/freebie/active.json', data);
}

// 删除买赠活动
export function deleteFreebieActive(data) {
  return request('DELETE', '/freebie/active.json', data);
}

// 更新买赠活动
export function updateFreebieActive(data) {
  return request('PUT', '/freebie/active.json', data);
}

// 查询买赠详情
export function getFreebieActive(data) {
  return request('GET', '/freebie/getDetailById.json', data);
}

// 查看效果数据
export function getEffectData(data) {
  return request('GET', `/freebie/effectData.json`, data);
}

// 查看买赠活动详情
export function getDetailById(params) {
  return request('GET', '/freebie/getDetailById.json', params);
}

// 创建买赠活动
export function create(data) {
  return request('POST', '/freebie/create.json', data);
}

// 更新买赠活动
export function update(data) {
  return request('POST', '/freebie/update.json', data);
}

export function findPresentGoods(data) {
  return ajax({
    method: 'get',
    url: `${BASE_URL}/vis/present-selector/presentList.json`,
    data,
  });
}

export function invalid(data) {
  return request('POST', '/freebie/invalid.json', data);
}

export function findWithSku(data) {
  return request('GET', '/freebie/findWithSku.json', data, false, 40000);
}

// 商品选择器
// 查询知识列表
export function getGoodsList(data) {
  return visAjax('GET', '/goods-selector/goodslist.json', data);
}

// 查询分组列表
export function getGroupList(data) {
  return visAjax('GET', '/goods-selector/grouplist.json', data);
}

// 获取sku列表
export function getSkuInfo(data) {
  return visAjax('GET', '/goods-selector/goodInfo.json', data);
}
