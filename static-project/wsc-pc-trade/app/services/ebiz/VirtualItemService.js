const BaseService = require('../base/BaseService');

/**
 * 虚拟商品 Service
 */
class VirtualItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.verify.VirtualItemService';
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439287
   * @param {Object} recordAdaptorRequestDTO
   */
  async findByPage(recordAdaptorRequestDTO) {
    return this.invoke('findByPage', [recordAdaptorRequestDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439285
   * @param {Object} virtualQueryAdaptorDTO
   */
  async getByOrderNo(virtualQueryAdaptorDTO) {
    return this.invoke('getByOrderNo', [virtualQueryAdaptorDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/439286
   * @param {Object} virtualQueryRequestDTO
   */
  async getVirtualDetail(virtualQueryRequestDTO) {
    return this.invoke('getVirtualDetail', [virtualQueryRequestDTO]);
  }

  /**
   * http://zanapi.qima-inc.com/site/service/view/439284
   *
   * @param {Object} request
   */
  async verify(request) {
    return this.invoke('verify', [request]);
  }
}

module.exports = VirtualItemService;
