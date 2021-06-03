import { ajax } from '@youzan/vis-ui';

export function register() {
  return ajax({
    url: '/wscvis/knowledge/register.json',
    type: 'post',
    loading: false,
  });
}
