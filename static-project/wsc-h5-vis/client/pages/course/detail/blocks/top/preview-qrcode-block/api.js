import { ajax } from '@youzan/vis-ui';

export function getQrcode(url) {
  return ajax({
    url: '/wscvis/knowledge/qrcode.json',
    data: {
      url,
      isShortenUrl: true,
    },
    loading: false,
  });
}
