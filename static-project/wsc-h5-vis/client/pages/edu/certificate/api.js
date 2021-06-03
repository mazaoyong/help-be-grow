import { ajax } from '@youzan/vis-ui';

// 学员列表
export function findByCustomerId(data) {
  return ajax({
    url: '/wscvis/edu/findByCustomerId.json',
    data,
  });
}
