import { ajax } from '@youzan/vis-ui';

export default {
  getShopQrCode(data) {
    return ajax({
      url: '/v2/weixin/scan/hosting.json',
      method: 'POST',
      data,
    });
  },
};
