import { ajax } from '@youzan/vis-ui';

export function getMpQrWithGoodInfo(data) {
  return ajax({
    url: '/wscvis/ump/getAutoReplyGoodsQrCode.json',
    data,
    loading: false,
  });
}
