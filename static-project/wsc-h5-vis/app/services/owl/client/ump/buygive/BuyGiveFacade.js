const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.ump.buygive.BuyGiveFacade -  */
class BuyGiveFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.buygive.BuyGiveFacade';
  }

  /**
   *  查询赠品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511378
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 赠品查询信息
   *  @param {string} query.orderNo - 订单号
   *  @param {string} query.alias - 商品alias
   *  @param {number} query.receiveStatus - 领取状态
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async findPresentByCondition(kdtId, query) {
    return this.invoke('findPresentByCondition', [kdtId, query]);
  }
  /**
   *  领取赠品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/530408
   *
   *  @param {number} kdtId -
   *  @param {string} receiveCommand - 领取请求
   *  @return {Promise}
   */
  async receive(kdtId, receiveCommand) {
    return this.invoke('receive', [kdtId, receiveCommand]);
  }
}

module.exports = BuyGiveFacade;
