import { visAjax } from 'fns/new-ajax';

const livePrefix = '/course/live';

// 结束直播
export function postUpdateCloseLive(data) {
  return visAjax('POST', `${livePrefix}/updateCloseLive.json`, data);
}
