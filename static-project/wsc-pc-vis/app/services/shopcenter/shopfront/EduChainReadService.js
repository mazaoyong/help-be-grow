const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.shopfront.api.service.chain.EduChainReadService -  */
class EduChainReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.chain.EduChainReadService';
  }

  /**
   *  查询校区信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/437676
   *
   *  @param {number} hqKdtId - 总部kdtId
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise}
   */
  async querySubShop(hqKdtId, kdtId) {
    return this.invoke('querySubShop', [hqKdtId, kdtId]);
  }

  /**
   *  查询校区创建校验信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/415877
   *
   *  @param {number} hqKdtId - 店铺kdtId
   *  @return {Promise}
   */
  async querySubShopCreateCheckInfo(hqKdtId) {
    return this.invoke('querySubShopCreateCheckInfo', [hqKdtId]);
  }
}

module.exports = EduChainReadService;
