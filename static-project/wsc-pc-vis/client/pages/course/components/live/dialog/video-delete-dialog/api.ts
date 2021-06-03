import { visAjax } from 'fns/new-ajax';

const livePrefix = '/course/live';

// 删除直播
export function deleteLive(data) {
  return visAjax('POST', `${livePrefix}/deleteLive.json`, data);
}
