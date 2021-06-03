const BaseService = require('../base/BaseService');

/**
 * RegionService
 */
class RegionService extends BaseService {
  /**
   * @return {string}
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.RegionService';
  }

  /**
   * 查询分区地址（含海外地址、三级地址）
   * @param {Object} param
   * @param {boolean} param.showOversea 是否返回海外地址
   * 文档: http://zanapi.qima-inc.com/site/service/view/111074
   */
  async getRegionPartitions(param) {
    return this.invoke('getRegionPartitions', [
      {
        ...param,
        fromApp: 'wsc',
      },
    ]);
  }
}

module.exports = RegionService;
