const BaseService = require('./ShopBaseService');

/**
 * ShopBaseReadService
 */
class ShopBaseReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.ShopBaseReadService';
  }

  /**
   * 根据 kdtId 获取 merchantId
   *
   * @param {number} kdtId
   *
   * @return {Promise<number>}
   *
   * @memberof ShopBaseReadService
   *
   * Doc: https://doc.qima-inc.com/pages/viewpage.action?pageId=18154830
   */
  async getPaymentByKdtId(kdtId) {
    return this.invoke('getPaymentByKdtId', [kdtId], {
      allowBigNumberInJSON: true,
      processCb: response => {
        const { baseResult = {}, paymentClientId, paymentSignKey } = response;
        if (baseResult.isSuccess) {
          response.code = 200;
          response.data = {
            paymentClientId,
            paymentSignKey,
          };
        }
        return response;
      },
    });
  }
}

module.exports = ShopBaseReadService;
