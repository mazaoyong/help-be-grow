import { ajax } from '@youzan/vis-ui';

export default {
  getActivityPoster(data) {
    return ajax({
      url: '/wscvis/ump/activity/poster.json',
      data,
      loading: false,
    });
  },

  // 二维码接口
  getQrCode(data) {
    return ajax({
      url: '/wscvis/knowledge/qrcode.json',
      data,
      loading: false,
    });
  },
};
