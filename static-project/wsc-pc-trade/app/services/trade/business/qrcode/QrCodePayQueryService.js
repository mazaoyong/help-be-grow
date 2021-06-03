const BaseService = require('../../../base/BaseService');
/**
 * com.youzan.trade.business.qrcode.api.query.QrCodePayQueryService
 */
class QrCodePayQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.qrcode.api.query.QrCodePayQueryService';
  }

  /**
   *  二维码收款记录查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/269750
   *  @param {Object} qrCodePayListQueryOption
   *  @param {number} qrCodePayListQueryOption.pageOrderType - 分页排序方式 1.created_time 2.created_time desc
   *  @param {string} qrCodePayListQueryOption.qrName - 收款码名称
   *  @param {number} qrCodePayListQueryOption.labelId - 标签
   *  @param {number} qrCodePayListQueryOption.kdtId - 店铺id
   *  @param {number} qrCodePayListQueryOption.qrType - 收款码类型
   *  @param {number} qrCodePayListQueryOption.pageSize - 每页条数
   *  @param {number} qrCodePayListQueryOption.page - 当前页(默认从0开始)
   *  @param {number} qrCodePayListQueryOption.storeId - 网点id
   *  @return {Promise}
   */
  async queryQrCodePayList(qrCodePayListQueryOption) {
    return this.invoke('queryQrCodePayList', [qrCodePayListQueryOption]);
  }
}

module.exports = QrCodePayQueryService;
