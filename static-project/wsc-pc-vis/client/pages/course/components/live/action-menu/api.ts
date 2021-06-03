import { visAjax } from 'fns/new-ajax';

const livePrefix = '/course/live';

// 删除直播
export function deleteLive(data) {
  return visAjax('POST', `${livePrefix}/deleteLive.json`, data);
}

// 更新显示/隐藏状态
export function updateShowOrHideStatus(data) {
  return visAjax('POST', `${livePrefix}/updateShowOrHideStatus.json`, data);
}

// 结束直播
export function updateCloseLive(data) {
  return visAjax('POST', `${livePrefix}/updateCloseLive.json`, data);
}

// 进入直播间信息查询
export function getLiveEnterInfo(data) {
  return visAjax('GET', `${livePrefix}/polyv/getLiveEnterInfo.json`, data);
}

// 获取保利威直播管理页面链接
export function getPolyvBackLink(data) {
  return visAjax('GET', `${livePrefix}/polyv/getPolyvBackLink.json`, data);
}

// 创建保利威直播前的鉴权&数量校验
export function polyvCheck() {
  return visAjax('GET', `${livePrefix}/polyv/polyvCheck.json`);
}

// 直播设置免费
export function updateFreeLive(data) {
  return visAjax('POST', `${livePrefix}/updateFreeLive.json`, data);
}

// 创建视频直播前的余额校验
export function videoCheck(data) {
  return visAjax('GET', `${livePrefix}/video/liveVideoCreateCheck.json`, data);
}
