import { visAjax } from 'fns/new-ajax';

const livePrefix = '/course/live';

// 开启/关闭回放
export function postPlaybackOpen(data) {
  return visAjax('POST', `${livePrefix}/video/playbackOpen.json`, data);
}
