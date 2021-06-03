import { visAjax } from 'fns/new-ajax';

const livePrefix = '/course/live';

// 充值
export function refreshSurvey(data) {
  return visAjax('POST', `${livePrefix}/video/confirmRecharge.json`, data);
}
