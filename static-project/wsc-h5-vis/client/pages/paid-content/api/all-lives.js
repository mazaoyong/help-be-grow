import { ajax } from '@youzan/vis-ui';

export function findPageForWym(data) {
  return ajax({
    url: '/wscvis/course/live/api/findPageForWym.json',
    data,
  });
};
