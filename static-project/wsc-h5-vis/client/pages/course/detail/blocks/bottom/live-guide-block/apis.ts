import { ajax } from '@youzan/vis-ui';

export function getShortenUrl(data: any): Promise<string> {
  return ajax({
    url: '/wscvis/common/url/getShortenUrl.json',
    data,
    loading: false,
  });
}
