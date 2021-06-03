import { ajax } from '@youzan/vis-ui';

export function getBoughtList(data) {
  return ajax({
    url: '/wscvis/supv/punch/getBoughtList.json',
    data,
  });
}
