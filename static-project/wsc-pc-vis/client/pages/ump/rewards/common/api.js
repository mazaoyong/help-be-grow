import { visAjax } from 'fns/new-ajax';

// 获取线下课相关信息
export function getRewardsRelationInfo(data) {
  return visAjax('GET', '/edu/rewards/getInfo.json', data);
}

// 创建奖励
export function createReward(data) {
  return visAjax('POST', '/edu/rewards/createReward.json', data);
}

// 更新奖励
export function updateReward(data) {
  return visAjax('POST', '/edu/rewards/updateReward.json', data);
}

// 奖励活动列表
export function getRewardsList(data) {
  return visAjax('GET', '/edu/rewards/getRewardsList.json', data);
}

// 奖励领取列表
export function getRecordsList(data) {
  return visAjax('GET', '/edu/rewards/getRecordsList.json', data);
}

// 更新奖励状态
export function updateRewardStatus(data) {
  return visAjax('POST', '/edu/rewards/updateRewardStatus.json', data);
}

// 优惠券列表
export function getCouponListAPI(data) {
  return visAjax('GET', '/edu/rewards/getCoupons.json', data);
}

export function getRewardsActivity(data) {
  return visAjax('GET', '/edu/rewards/getRewardActivity.json', data);
}

export function submitExportRewardRecordTask(data) {
  return visAjax('POST', '/edu/rewards/submitExportRewardRecordTask.json', data);
}

// // 获取优惠券列表数据
// export function getCouponListAPI() {
//   return visAjax('GET', '/ump/common/api/coupons');
// }
// export function listCouponListByIdsAPI(data) {
//   return visAjax('POST', '/pct/retail/couponByIds.json', data);
// }
