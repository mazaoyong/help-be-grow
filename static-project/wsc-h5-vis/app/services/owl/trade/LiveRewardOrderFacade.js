const BaseService = require('../../base/BaseService');

class LiveRewardOrderFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.trade.LiveRewardOrderFacade';
  }

  /**
   *  视频直播打赏下单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896287
   *
   *  @param {Object} command -
   *  @param {number} command.realPay - 支付金额
   *  @param {number} command.kdtId - 店铺ID
   *  @param {string} command.callbackUrl - 回调地址
   *  @param {number} command.userId - 用户ID
   *  @param {number} command.alias - 直播间alias
   *  @return {Promise}
   */
  async create(command) {
    return this.invoke('create', [command]);
  }
}

module.exports = LiveRewardOrderFacade;
