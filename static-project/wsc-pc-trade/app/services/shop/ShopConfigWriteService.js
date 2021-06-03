const ShopBaseService = require('./ShopBaseService');
/**
 * 店铺配置service
 * @extends ShopBaseService
 */
class ShopConfigWriteService extends ShopBaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopconfig.api.service.ShopConfigWriteService';
  }

  /**
   * 设置店铺配置
   * @link http://zanapi.qima-inc.com/site/service/view/76614
   * @param {*} params config
   */
  async setShopConfig(params) {
    return this.invoke('setShopConfig', [params]);
  }
}

module.exports = ShopConfigWriteService;
