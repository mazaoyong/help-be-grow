// 公众号海报相关接口
import request from 'fns/pct-ajax';

// 海报列表
export function getPosterLists(data) {
  return request('GET', '/poster/lists.json', data);
}

// 推广效果
export function getEffectLists(data) {
  return request('GET', '/poster/effectLists.json', data);
}

// 创建海报活动
export function createPosterActive(data) {
  return request('POST', '/poster/active.json', data);
}

// 删除海报活动
export function deletePosterActive(id) {
  return request('DELETE', '/poster/active.json', { posterId: id });
}

// 更新海报活动
export function updatePosterActive(data) {
  return request('PUT', '/poster/active.json', data);
}

// 查询海报详情
export function getPosterActive(id) {
  return request('GET', '/poster/active.json', { posterId: id });
}

// 推广海报活动
export function popularizePosterActive(id) {
  return request('GET', '/poster/popularize.json', { posterId: id });
}

// 结束海报活动
export function terminatePosterActive(id) {
  return request('GET', '/poster/terminate.json', { posterId: id });
}
