import { visAjax } from 'fns/new-ajax';

export function getRewardCopywriting(payload) {
  return visAjax('POST', '/ump/common/getRewardCopywriting.json', payload);
};
