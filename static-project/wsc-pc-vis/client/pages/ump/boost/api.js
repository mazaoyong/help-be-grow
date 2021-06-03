import { visAjax } from 'fns/new-ajax';

// 创建好友助力
export function createBoostAPI(data) {
  return visAjax('POST', '/pct/boost/activity.json', data);
}

// 删除好友助力
export function deleteBoostAPI(id) {
  return visAjax('DELETE', '/pct/boost/active.json', { id });
}

// 更新好友助力
export function updateBoostAPI(data) {
  return visAjax('PUT', '/pct/boost/activity.json', data);
}

// 结束活动
export function invalidBoostAPI(id) {
  return visAjax('PUT', '/pct/boost/invalid.json', { id });
}

export function listHisotryAPI(data) {
  return visAjax('POST', '/pct/boost/historyList.json', data);
}

// 优惠券列表
export function getCouponListAPI(data) {
  return visAjax('GET', '/pct/retail/coupon.json', data);
}

export function listCouponListByIdsAPI(data) {
  return visAjax('POST', '/pct/retail/couponByIds.json', data);
}

// 获取SKU信息
export function getSkuInfoAPI(data) {
  return visAjax('GET', '/goods-selector/goodInfo.json', data);
}
