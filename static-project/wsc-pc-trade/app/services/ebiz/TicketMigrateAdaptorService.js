const BaseService = require('../base/BaseService');

/**
 * 电子卡券 Service
 */
class TicketMigrateAdaptorService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.virtualticket.TicketMigrateAdaptorService';
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439277
   * @param {Object} requestAdaptorDTO
   */
  async findByPage(requestAdaptorDTO) {
    return this.invoke('findByPage', [requestAdaptorDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439278
   * @param {Object} orderVirtualRequestDTO
   */
  async getTicketDetailByTicketCode(orderVirtualRequestDTO) {
    return this.invoke('getTicketDetailByTicketCode', [orderVirtualRequestDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439279
   * @param {Object} request
   */
  async verify(request) {
    return this.invoke('verifyBatch', [request]);
  }
}

module.exports = TicketMigrateAdaptorService;
