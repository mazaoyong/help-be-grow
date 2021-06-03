import ajax from 'zan-pc-ajax';
import { Notify } from 'zent';
import { Room } from './types';

interface LiveListParams {
  page: number;
}

interface LiveListResult {
  list: Room[];
  total: number;
}

const base = {
  kdtId: _global.kdtId,
};

export function fetchLiveList(params: LiveListParams): Promise<LiveListResult> {
  return ajax({
    url: '/v4/shop/decorate/weapp-live/list.json',
    data: { ...base, ...params },
  }).catch(err => {
    Notify.error(JSON.stringify(err || '获取小程序直播间出错，请稍后重试'));
    return { list: [], total: 0 };
  });
}
