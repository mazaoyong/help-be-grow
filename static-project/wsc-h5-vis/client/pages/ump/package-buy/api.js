import { ajax } from '@youzan/vis-ui';

export default {
  // 查询活动列表
  getPackageList(data) {
    return ajax({
      url: '/wscvis/ump/listActivityDetail.json',
      data,
    });
  },

  // 查询sku
  getSkus(data) {
    return ajax({
      url: '/wscvis/ump/getGoodsAllSku.json',
      data,
    });
  },
};
