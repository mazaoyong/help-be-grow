const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.trade.business.qrcode.api.operate.QrCodeUpdateService
 */
class QrCodeUpdateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.qrcode.api.operate.QrCodeUpdateService';
  }

  /**
   *  编辑二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125710
   *
   *  @param {Object} qrCodeUpdateRequestDTO
   *  @param {string} qrCodeUpdateRequestDTO.qrName - 二维码名称
   *  @param {Array.<Array>} qrCodeUpdateRequestDTO.labelIds[] - 标签Id
   *  @param {number} qrCodeUpdateRequestDTO.operateId - 二维码优惠状态更新人operate_id
   *  @param {number} qrCodeUpdateRequestDTO.price - 价格单位：分
   *  @param {Object} qrCodeUpdateRequestDTO.qrPromotionInfoDTO - 二维码优惠信息
   *  @param {number} qrCodeUpdateRequestDTO.qrId - 二维码Id
   *  @param {string} qrCodeUpdateRequestDTO.targetNo - 第三方编码
   *  @param {boolean} qrCodeUpdateRequestDTO.needUpdatePromotionInfo - 是否需要更新优惠信息
   *  @param {boolean} qrCodeUpdateRequestDTO.needUpdateLabelsInfo - 是否需要更新标签信息
   *  @param {boolean} qrCodeUpdateRequestDTO.useDiscount - 二维码优惠状态：false-关闭优惠    true-开启优惠 --用于多网点支持单独二维码使某个网点的优惠生效或者失效
   *  @return {Promise}
   */
  async editQrCode(qrCodeUpdateRequestDTO) {
    return this.invoke('editQrCode', [qrCodeUpdateRequestDTO]);
  }

  /**
   *  删除二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/480196
   *
   *  @param {Object} qrCodeDeleteRequestDTO -
   *  @param {number} qrCodeDeleteRequestDTO.kdtId - 店铺id
   *  @param {number} qrCodeDeleteRequestDTO.qrId - 二维码Id
   *  @param {number} qrCodeDeleteRequestDTO.userId - 操作人id
   *  @return {Promise}
   */
  async deleteQrCode(qrCodeDeleteRequestDTO) {
    return this.invoke('deleteQrCode', [qrCodeDeleteRequestDTO]);
  }
}

module.exports = QrCodeUpdateService;
