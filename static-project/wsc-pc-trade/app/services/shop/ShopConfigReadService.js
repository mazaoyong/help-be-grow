const ShopBaseService = require('./ShopBaseService');

/**
 * 店铺配置service
 * @extends ShopBaseService
 */
class ShopConfigReadService extends ShopBaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopconfig.api.service.ShopConfigReadService';
  }

  /**
   *  查询单个店铺单个配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/76608
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @param {string} key - 配置项key
   *  @return {Promise}
   */
  async queryShopConfig(kdtId, key) {
    return this.invoke('queryShopConfig', [kdtId, key]);
  }
}

module.exports = ShopConfigReadService;
