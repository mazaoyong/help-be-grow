const PCNovaBaseService = require('@youzan/wsc-pc-base/app/services/base/PCNovaBaseService');
/**
 * com.youzan.shopcenter.shop.service
 */
class ShopBaseReadService extends PCNovaBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.ShopBaseReadService';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/8988
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getShopBaseInfoByKdtId(kdtId) {
    return this.invoke('getShopBaseInfoByKdtId', [kdtId], {
      key: 'shopBaseInfo',
    });
  }
}

module.exports = ShopBaseReadService;
