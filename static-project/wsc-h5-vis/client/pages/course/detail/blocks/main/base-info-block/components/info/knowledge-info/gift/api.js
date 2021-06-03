import { ajax } from '@youzan/vis-ui';

export function getShareAlias(alias) {
  return ajax({
    url: '/wscvis/knowledge/getShareAlias.json',
    data: {
      alias,
    },
    loading: false,
  });
}
