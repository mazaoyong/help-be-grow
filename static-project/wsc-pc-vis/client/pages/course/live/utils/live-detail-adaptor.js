import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import formatDate from 'zan-utils/date/formatDate';

export function parseLiveDetail(res) {
  res.publishAt = formatDate(res.publishAt, 'YYYY-MM-DD HH:mm:ss');
  res.liveId = res.id;
  res.publishAtStr = res.publishAt;
  res.liveStartAt = formatDate(res.liveStartAt, 'YYYY-MM-DD HH:mm:ss');
  res.liveStartAtStr = res.liveStartAt;
  return mapKeysToSnakeCase(res, false);
}

export function parseLiveList(res) {
  res.content = res.content.map(live => { return parseLiveDetail(live); });
  return res;
}

export function transLiveFormData(req) {
  // IRON迁移 字段映射
  req.id = req.live_id;
  delete req.live_id;

  req.liveStartAt = req.live_start_at;
  delete req.live_start_at;

  return mapKeysToCamelCase(req);
}
