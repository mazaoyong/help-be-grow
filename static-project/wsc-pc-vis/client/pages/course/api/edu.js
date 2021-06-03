import { visAjax } from 'fns/new-ajax';

export function getActivityCode(params) {
  return visAjax('GET', '/edu/reserve/activityCode.json', params);
}
