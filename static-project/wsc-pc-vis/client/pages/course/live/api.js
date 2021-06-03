import { visAjax } from 'fns/new-ajax';
import { parseLiveDetail, parseLiveList } from './utils/live-detail-adaptor';

/**
 * ### 直播 iron 迁移新接口 start ###
 */
const livePrefix = '/course/live';

// 创建直播商品
export function createLive(data) {
  return visAjax('POST', `${livePrefix}/_textarea_/createLive.json`, data);
}

// 创建直播商品
export function updateLive(data) {
  return visAjax('POST', `${livePrefix}/_textarea_/updateLive.json`, data);
}

// 获取直播详情
export function getByAlias(data) {
  return visAjax('GET', `${livePrefix}/getByAlias.json`, data)
    .then(res => parseLiveDetail(res));
}

// 按照条件查询相关的直播商品
export function findPageByCondition(data) {
  return visAjax('GET', `${livePrefix}/findPageByCondition.json`, data, { cleanEmptyKey: true })
    .then(res => parseLiveList(res));
}

// 删除直播
export function deleteLive(data) {
  return visAjax('POST', `${livePrefix}/deleteLive.json`, data);
}

// 更新直播排序值
export function updateSerialNo(data) {
  return visAjax('POST', `${livePrefix}/updateSerialNo.json`, data);
}

// 更新显示/隐藏状态
export function updateShowOrHideStatus(data) {
  return visAjax('POST', `${livePrefix}/updateShowOrHideStatus.json`, data);
}

// 结束直播
export function updateCloseLive(data) {
  return visAjax('POST', `${livePrefix}/updateCloseLive.json`, data);
}

// 获取直播管理员邀请码
export function getLiveInviteAdminCode(data) {
  return visAjax('GET', `${livePrefix}/getLiveInviteAdminCode.json`, data);
}

// 快捷更改内容名称，价格
export function quickUpdateLiveByAlias(data) {
  return visAjax('POST', `${livePrefix}/quickUpdateLiveByAlias.json`, data);
}

// 获取视频直播剩余能力
export function getLiveVideoSurplus(data) {
  return visAjax('GET', `${livePrefix}/video/liveVideoSurplus.json`, data);
}

// 视频直播统计
export function getLiveVideoSurvey(data) {
  return visAjax('GET', `${livePrefix}/video/liveVideoSurveyV2.json`, data);
}

// 刷新 & 视频直播统计
export function getRefreshSurvey(data) {
  return visAjax('GET', `${livePrefix}/video/refreshSurveyV2.json`, data);
}

// 异步创建直播
export function postAsyncCreateLive(data) {
  return visAjax('POST', `${livePrefix}/video/asyncCreateLive.json`, data);
}

// 返回当前直播频道的创建状态
export function getAsyncCreateStatus(data) {
  return visAjax('GET', `${livePrefix}/video/getAsyncCreateStatus.json`, data);
}

/**
 * ### 专栏iron 迁移新接口 end ###
 */

// // 添加直播
// export function addLive(data) {
//   return makeRequest('POST', '/ump/paidcontent/live.json', data);
// }

// // 更新直播
// export function updateLive(data) {
//   return makeRequest('PUT', '/ump/paidcontent/live.json', data);
// }

// 获取直播详情
// export function getLiveDetail(data) {
//   return makeRequest('GET', '/ump/paidcontent/liveDetail.json', data);
// }

export function checkLiveAuth() {
  return visAjax('GET', '/common/shop/checkAuth.json', {});
}
