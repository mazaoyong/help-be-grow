const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.trade.business.qrcode.api.query.QrCodeQueryService -
 */
class QrcodeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.qrcode.api.query.QrCodeQueryService';
  }

  /**
   *  查询店铺所有二维码列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125687
   *  @param {Object} qrCodeQueryListOption
   *  @param {number} qrCodeQueryListOption.pageOrderType - 分页排序方式 1.created_time 2.created_time desc
   *  @param {number} qrCodeQueryListOption.kdtId - 店铺id
   *  @param {number} qrCodeQueryListOption.pageSize - 每页条数
   *  @param {boolean} qrCodeQueryListOption.needPromotionInfo - 是否需要优惠信息
   *  @param {boolean} qrCodeQueryListOption.needLabelInfo - 是否需要标签信息
   *  @param {string} qrCodeQueryListOption.qrName - 二维码名称
   *  @param {Array.<Array>} qrCodeQueryListOption.labelIds[] - 标签
   *  @param {string} qrCodeQueryListOption.extra - 附加字段
   *  @param {Array.<Array>} qrCodeQueryListOption.qrTypes[] - 二维码类型
   *  @param {number} qrCodeQueryListOption.shopType - 门店/网点类型
   *  @param {number} qrCodeQueryListOption.shopId - 门店id
   *  @param {number} qrCodeQueryListOption.page - 当前页(默认从0开始)
   *  @param {boolean} qrCodeQueryListOption.needPaging - 分页参数
   *  @return {Promise}
   */
  async queryQrCodeList(qrCodeQueryListOption) {
    return this.invoke('queryQrCodeList', [qrCodeQueryListOption]);
  }

  /**
   *  查询店铺二维码单个查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/244701
   *
   *  @param {Object} queryQrCodeOption -
   *  @param {number} queryQrCodeOption.qrId - 二维码id
   *  @param {boolean} queryQrCodeOption.needPromotionInfo - 是否需要优惠信息
   *  @param {boolean} queryQrCodeOption.needLabelInfo - 是否需要标签信息
   *  @return {Promise}
   */
  async queryQrCodeByQrId(queryQrCodeOption) {
    return this.invoke('queryQrCodeByQrId', [queryQrCodeOption]);
  }
}

module.exports = QrcodeService;
