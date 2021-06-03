import { visAjax } from 'fns/new-ajax';

export function batchCancelV2(data) {
  return visAjax('POST', '/edu/appointment/batchCancelV2.json', data);
}