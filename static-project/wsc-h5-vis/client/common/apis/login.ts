import { ajax } from '@youzan/vis-ui';

export function logout(): Promise<any> {
  return ajax({
    url: 'https://passport.youzan.com/logout.json',
    method: 'POST',
    loading: false,
  });
}
