const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.trade.PaySuccessAggrFacade -  */
class PaySuccessAggrFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.trade.PaySuccessAggrFacade';
  }

  /**
   *  获取支付落地页需要的详情信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509442
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async getPaySuccessInfo(kdtId, orderNo, userId) {
    return this.owlInvoke('getPaySuccessInfo', [kdtId, orderNo, userId]);
  }

  async getPaySuccessInfoV2(kdtId, payStateQuery) {
    return this.owlInvoke('getPaySuccessInfoV2', [kdtId, payStateQuery]);
  }

  /**
   *  查询支付状态信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/618909
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} payStateQuery - 查询入参
   *  @param {string} payStateQuery.orderNo - 订单号
   *  @param {number} payStateQuery.userId - 用户ID
   *  @return {Promise}
   */
  async queryPayStatusInfo(kdtId, payStateQuery) {
    return this.owlInvoke('queryPayStatusInfo', [kdtId, payStateQuery]);
  }

  /**
   *  查询订单及时奖励信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/606082
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} payRewardQuery - 查询入参
   *  @param {string} payRewardQuery.orderNo - 订单号
   *  @param {number} payRewardQuery.userId - 用户ID
   *  @return {Promise}
   */
  async queryPayRewardInfo(kdtId, payRewardQuery) {
    return this.owlInvoke('queryPayRewardInfo', [kdtId, payRewardQuery]);
  }

  /**
   *  推荐商品信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/637765
   *
   *  @param {number} kdtId - kdtId
   *  @return {Promise}
   */
  async queryPayGoodsRecommendInfo(kdtId) {
    return this.invoke('queryPayGoodsRecommendInfo', [kdtId]);
  }

  /**
   *  查询推荐商品信息，根据不同的业务场景
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/993256
   *
   *  @param {number} kdtId - kdtId
   *  @param {Object} goodsRecommendQuery - 查询入参
   *  @param {number} payRewardQuery.scene - 查询的场景 1: 转介绍场景
   *  @return {Promise}
   */
  async queryGoodsRecommendInfo(kdtId, goodsRecommendQuery) {
    return this.invoke('queryGoodsRecommendInfo', [kdtId, goodsRecommendQuery]);
  }

  /**
   *  获取商品加粉推广信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/660146
   *
   *  @param {number} kdtId - 店铺
   *  @param {string} alias - 商品alias
   *  @return {Promise}
   */
  async queryPayJoinGroupSettingInfo(kdtId, alias) {
    return this.invoke('queryPayJoinGroupSettingInfo', [kdtId, alias]);
  }
}

module.exports = PaySuccessAggrFacade;
