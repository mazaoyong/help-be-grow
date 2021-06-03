const BaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/**
 * com.youzan.trade.plugin.api.sellermanager.SellerManagerService
 */
class SellerManagerService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.plugin.api.sellermanager.SellerManagerService';
  }

  /**
   *  酒店-接单接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125371
   *
   *  @param {Object} requestDTO -
   *  @param {string} requestDTO.orderNo - 订单号
   *  @param {number} requestDTO.userId - 用户ID
   *  @return {Promise}
   */
  async pickOrder(requestDTO) {
    return this.invoke('pickOrder', [requestDTO]);
  }

  /**
   *  酒店-拒单接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125372
   *
   *  @param {Object} requestDTO
   *  @param {string} requestDTO.orderNo - 订单号
   *  @param {string} requestDTO.role - 拒单角色 不填默认 :seller system buyer
   *  @param {number} requestDTO.userId - 用户ID
   *  @param {string} requestDTO.refuseReason - 拒单理由,三方外卖使用,目前不在内部存储
   *  @return {Promise}
   */
  async refuseOrder(requestDTO) {
    return this.invoke('refuseOrder', [requestDTO]);
  }
}

module.exports = SellerManagerService;
