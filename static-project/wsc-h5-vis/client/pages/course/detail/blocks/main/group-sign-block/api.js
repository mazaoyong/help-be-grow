import { ajax } from '@youzan/vis-ui';

export function getSupportPunch(columnAlias) {
  return ajax({
    url: '/wscvis/supv/punch/getSupportPunch.json',
    method: 'get',
    data: {
      columnAlias,
    },
    loading: false,
  });
}

export function getSupportPunches(columnAlias) {
  return ajax({
    url: '/wscvis/supv/punch/getSupportPunches.json',
    method: 'post',
    data: {
      columnAliases: [columnAlias],
    },
    loading: false,
  });
}
