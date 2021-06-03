const BaseService = require('../base/BaseService');
/**
 * com.youzan.shopcenter.shopfront.api.service.chain.WscChainReadService
 */
class WscChainReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.chain.WscChainReadService';
  }

  /**
   *  查询网店信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/437678
   *
   *  @param {number} hqKdtId - 总部kdtId
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise}
   */
  async querySubShop(hqKdtId, kdtId) {
    return this.invoke('querySubShop', [hqKdtId, kdtId]);
  }
}

module.exports = WscChainReadService;
