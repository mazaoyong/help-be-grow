const BusinessBaseService = require('./BusinessBaseService');
/**
 * 送礼子订单相关接口
 * @extends BusinessBaseService
 */
class GiftOrderService extends BusinessBaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.gift.api.GiftOrderService';
  }

  /**
   * 分页获取 子订单
   * @param {*} params config
   *
   * 文档: http://zanapi.qima-inc.com/site/service/view/173468
   */
  async queryGiftOrderInfoPage(params) {
    return this.invoke('queryGiftOrderInfoPage', [params], {
      allowBigNumberInJSON: true,
    });
  }
}

module.exports = GiftOrderService;
