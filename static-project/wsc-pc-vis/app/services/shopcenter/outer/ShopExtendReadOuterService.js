const BaseService = require('../../base/BaseService');

/**
 * om.youzan.shopcenter.outer.service.shop.ShopExtendReadOuterService
 */
class ShopExtendReadOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopExtendReadOuterService';
  }

  /**
   *  查询用户创建微商城教育版店铺状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/218808
   *
   *  @param {integer} accountId - 用户id
   *  @return {Object}
   */
  async queryWscEduCreateStat(accountId) {
    return this.invoke('queryWscEduCreateStat', [accountId]);
  }
}

module.exports = ShopExtendReadOuterService;
