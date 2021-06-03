import { ajax } from '@youzan/vis-ui';

const routePrefix = '/wscvis/supv/punch/list';

export function getAllPunchList(data) {
  return ajax({
    method: 'GET',
    url: `${routePrefix}/getAllPunchList.json`,
    data,
  });
}
