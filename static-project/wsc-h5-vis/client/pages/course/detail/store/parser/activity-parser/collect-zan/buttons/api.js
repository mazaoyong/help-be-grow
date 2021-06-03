import { ajax } from '@youzan/vis-ui';

export function buildZanSet(zanId, targetAlias, skuId) {
  return ajax({
    url: '/wscvis/knowledge/buildZanSet.json',
    data: {
      zanId,
      targetAlias,
      skuId,
    },
  });
}
