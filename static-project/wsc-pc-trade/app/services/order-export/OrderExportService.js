const BaseService = require('../base/BaseService');

/**
 * 订单导出相关
 */
class OrderExportService extends BaseService {
  /**
   * OrderExportService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.export.OrderExportService';
  }

  /**
   *  订单导出
   * api: http://zanapi.qima-inc.com/site/service/view/104089
   *  @param {object} request - 导出条件
   */
  async export(request) {
    return this.invoke('export', [request]);
  }
}

module.exports = OrderExportService;
