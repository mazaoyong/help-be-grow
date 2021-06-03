const BaseService = require('../base/BaseService');

/**
 * @typedef {import('../../../definitions/order/export-list').IListRes} IListRes
 */

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.export.OrderExportService
 */
class OrderExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.export.OrderExportService';
  }

  /**
   * 获取导出列表
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104090
   *
   * @param {Object} requestDTO - 导出列表请求参数
   * @param {number} requestDTO.kdtId -
   * @param {string} requestDTO.bizType -
   * @param {number} requestDTO.page -
   * @param {number} requestDTO.size -
   * @param {boolean} requestDTO.isScroll -
   * @return {Promise<IListRes>}
   */
  async listExportRecord(requestDTO) {
    return this.invoke('listExportRecord', [requestDTO]);
  }
}

module.exports = OrderExportService;
