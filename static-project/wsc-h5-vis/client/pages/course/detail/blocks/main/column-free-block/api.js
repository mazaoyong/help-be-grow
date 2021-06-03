import { ajax } from '@youzan/vis-ui';

export function getFreeContentAndLive(columnAlias, sortType) {
  return ajax({
    url: '/wscvis/knowledge/getFreeContentAndLive.json',
    data: {
      columnAlias,
      sortType,
    },
    loading: false,
  });
}
