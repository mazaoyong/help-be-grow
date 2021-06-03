const BaseService = require('../base/BaseService');

/**
 * RegionV3Service
 */
class RegionV3Service extends BaseService {
  /**
   * @return {string}
   */
  get SERVICE_NAME() {
    return 'com.youzan.delivery.service.RegionV3Service';
  }

  /**
   * 返回所有地址的id - name 映射
   * @param {Object} param
   * @param {boolean} param.showOversea 是否返回海外地址
   * 文档: http://zanapi.qima-inc.com/site/service/view/200856
   */
  async getAllIdNameMap(param) {
    return this.invoke('getAllIdNameMap', [param]);
  }
}

module.exports = RegionV3Service;
