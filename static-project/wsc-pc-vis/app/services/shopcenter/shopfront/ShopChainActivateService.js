const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.shopfront.api.service.chain.ShopChainActivateService -  */
class ShopChainActivateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.chain.ShopChainActivateService';
  }

  /**
   *  激活分店中应用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/436789
   *
   *  @param {Object} request - {@link SubShopAppActivateRequest}
   *  @param {number} request.hqKdtId -
   *  @param {number} request.appId -
   *  @param {number} request.subShopKdtId -
   *  @return {Promise}
   */
  async activateAppInSubShop(request) {
    return this.invoke('activateAppInSubShop', [request]);
  }
}

module.exports = ShopChainActivateService;
