const BaseService = require('../base/BaseService');

/**
 * service
 * @extends BaseService
 */
class ShopChainPageQueryOuterService extends BaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.chain.ShopChainPageQueryOuterService';
  }

  /**
   * 分页查询某店铺下所有的后代节点
   * http://zanapi.qima-inc.com/site/service/view/197922
   * @param {*} params
   */
  async queryDescendentShopNodes(params) {
    return this.invoke('queryDescendentShopNodes', [params]);
  }
}

module.exports = ShopChainPageQueryOuterService;
