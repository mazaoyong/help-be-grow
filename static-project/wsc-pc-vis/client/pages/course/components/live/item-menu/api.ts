import { visAjax } from 'fns/new-ajax';

// 删除直播
export function deleteLive(data) {
  return visAjax('POST', '/course/live/deleteLive.json', data);
}

// 进入直播间信息查询
export function getLiveEnterInfo(data) {
  return visAjax('GET', '/course/live/polyv/getLiveEnterInfo.json', data);
}

// 获取保利威直播管理页面链接
export function getPolyvBackLink(data) {
  return visAjax('GET', '/course/live/polyv/getPolyvBackLink.json', data);
}
