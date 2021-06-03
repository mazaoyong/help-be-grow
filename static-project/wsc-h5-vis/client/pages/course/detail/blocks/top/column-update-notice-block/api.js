import { ajax } from '@youzan/vis-ui';

export function getWxFollowStatus(alias) {
  return ajax({
    url: '/wscvis/knowledge/utils/wxFollowStatus.json',
    data: {
      columnAlias: alias,
    },
    loading: false,
  });
}
