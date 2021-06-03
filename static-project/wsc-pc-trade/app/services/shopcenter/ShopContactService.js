const PCNovaBaseService = require('@youzan/wsc-pc-base/app/services/base/PCNovaBaseService');

/**
 * com.youzan.shopcenter.shop.service.ShopContactService
 */
class ShopContactService extends PCNovaBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.ShopContactService';
  }

  /**
   *  查询店铺联系方式
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/67919
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async queryShopContact(kdtId) {
    return this.invoke('queryShopContact', [kdtId], {
      key: 'shopContact',
    });
  }
}

module.exports = ShopContactService;
