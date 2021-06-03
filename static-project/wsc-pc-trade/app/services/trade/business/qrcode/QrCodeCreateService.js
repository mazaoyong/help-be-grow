const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.trade.business.qrcode.api.operate.QrCodeCreateService
 */
class QrCodeCreateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.qrcode.api.operate.QrCodeCreateService';
  }

  /**
   *  新建二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125756
   *  @param {Object} qrCodeCreateRequestDTO -
   *  @param {string} qrCodeCreateRequestDTO.qrName - 二维码名称
   *  @param {Array.<Array>} qrCodeCreateRequestDTO.labelIds[] - 标签Id
   *  @param {Object} qrCodeCreateRequestDTO.shopInfoDTO - 店铺信息
   *  @param {number} qrCodeCreateRequestDTO.price - 价格单位：分
   *  @param {Object} qrCodeCreateRequestDTO.qrPromotionInfoDTO - 二维码优惠信息
   *  @param {string} qrCodeCreateRequestDTO.extra - 附加字段
   *  @param {Object} qrCodeCreateRequestDTO.bindedOrderInfo - 买家信息(如果二维码类型为 9-绑定订单的二维码 则需要传此信息)
   *  @param {string} qrCodeCreateRequestDTO.targetNo - 第三方编码
   *  @param {number} qrCodeCreateRequestDTO.source - 来源内部：0外部：1
   *  @param {number} qrCodeCreateRequestDTO.targetKdtId - 目标店铺ID
   *  @param {number} qrCodeCreateRequestDTO.type - 二维码类型
   *  @return {Promise}
   */
  async createQrCode(qrCodeCreateRequestDTO) {
    return this.invoke('createQrCode', [qrCodeCreateRequestDTO]);
  }
}

module.exports = QrCodeCreateService;
