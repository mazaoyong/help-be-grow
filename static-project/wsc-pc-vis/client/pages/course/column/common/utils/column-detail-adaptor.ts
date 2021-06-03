import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import formatDate from 'zan-utils/date/formatDate';

export function parseColumnDetail(res) {
  res.publishAt = res.publishAt && formatDate(res.publishAt, 'YYYY-MM-DD HH:mm:ss');
  return mapKeysToSnakeCase(res, false);
}

export function parseColumnList(res) {
  res.content = res.content.map(column => { return parseColumnDetail(column); });
  return res;
}
