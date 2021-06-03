import { ajax } from '@youzan/vis-ui';

export function findPresentByCondition(alias) {
  return ajax({
    url: '/wscvis/ump/findPresentByCondition.json',
    data: {
      alias,
      receiveStatus: 1,
    },
    loading: false,
  });
}
