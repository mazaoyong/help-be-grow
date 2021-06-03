const BaseService = require('../../../base/BaseService');

/* com.youzan.shopcenter.outer.service.riskcontrol.ShopRiskcontrolReadOuterService -  */
class ShopRiskcontrolReadOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.riskcontrol.ShopRiskcontrolReadOuterService';
  }

  /**
   *  查询单个店铺功能锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/365116
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @param {string} key - 配置项key
   *  @return {Promise}
   */
  async queryShopFuncLock(kdtId, key) {
    return this.invoke('queryShopFuncLock', [kdtId, key]);
  }
}

module.exports = ShopRiskcontrolReadOuterService;
