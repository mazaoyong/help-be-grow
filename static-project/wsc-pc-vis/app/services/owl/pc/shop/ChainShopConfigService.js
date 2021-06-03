const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.shop.ChainShopConfigFacade -  */
class ChainShopConfigFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.shop.ChainShopConfigFacade';
  }

  /**
   *  查询教育校区的店铺信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/983723
   *
   *  @param {number} hqKdtId - 总店店铺id
   *  @param {number} kdtId - 校区店铺id
   *  @return {Promise}
   */
  async querySubShop(hqKdtId, kdtId) {
    return this.invoke('querySubShop', [hqKdtId, kdtId]);
  }
}

module.exports = ChainShopConfigFacade;
