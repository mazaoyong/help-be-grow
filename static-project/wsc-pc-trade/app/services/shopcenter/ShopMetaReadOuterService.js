const BaseService = require('../base/BaseService');

/**
 * 查询店铺元数据
 * @extends BaseService
 */
class ShopMetaReadOuterService extends BaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopMetaReadOuterService';
  }

  /**
   * 查询店铺元数据
   * http://zanapi.qima-inc.com/site/service/view/218798
   * @param {*} kdtId
   */
  async queryShopMetaInfo(kdtId) {
    return this.invoke('queryShopMetaInfo', [kdtId]);
  }
}

module.exports = ShopMetaReadOuterService;
