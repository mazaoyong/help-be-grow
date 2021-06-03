const BaseService = require('./DeliveryBaseService');

/**
 * @class DeliveryOrderExpressService
 * @extends {BaseService}
 */
class DeliveryOrderExpressService extends BaseService {
  /**
   * @readonly
   * @memberof DeliveryOrderExpressService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.DeliveryOrderExpressService';
  }

  /**
   * 重新打印
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/94509
   *
   * @param {object} param -
   * @param {string} param.packId - 包裹单号
   * @param {number} param.sourceId - 渠道id
   * @param {string} param.printerDeviceNo - 设备编号
   * @param {number} param.kdtId - 店铺id
   * @param {string} param.orderId - 外部订单号
   * @param {string} param.fromApp - 请求来源app
   * @param {string} param.requestId - UUID
   * @param {number} param.printerChannel - 打印机型号 365打印：1
   * @param {number} param.storeId - 多网点门店id
   * @param {string} param.printerKey - 设备密钥
   * @return {object}
   */
  async retryPrint(param) {
    return this.invoke('retryPrint', [param]);
  }
}

module.exports = DeliveryOrderExpressService;
