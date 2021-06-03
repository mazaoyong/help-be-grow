import { ajax } from '@youzan/vis-ui';

const routePrefix = '/wscvis/supv/punch/rank';

export function getPersonRank(data) {
  return ajax({
    method: 'GET',
    url: `${routePrefix}/getPersonRank.json`,
    data,
  });
}

export function getRankList(data) {
  return ajax({
    method: 'GET',
    url: `${routePrefix}/getRankList.json`,
    data,
  });
}
