import { ajax } from '@youzan/vis-ui';

export function getIsPaid(columnAlias) {
  return ajax({
    url: '/wscvis/knowledge/getIsPaid.json',
    data: {
      columnAlias,
    },
    loading: false,
  });
}
