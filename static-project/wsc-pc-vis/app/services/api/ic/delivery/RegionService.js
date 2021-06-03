const BaseService = require('../../../base/BaseService');

/**
 * region service
 */
class RegionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.RegionService';
  }

  /**
   * 获取省数据
   * http://zanapi.qima-inc.com/site/service/view/19275
   *
   * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=6819925
   * @param {*} params
   */
  async getProvinceMap(params) {
    const data = await this.invoke('getProvinceMap', [params]);
    return data;
  }

  /**
   * 获取城市映射列表
   *
   * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=6819927
   * @param {string} mapType
   * @param {string} provinceId
   * @return {Promise<Object>}
   */
  async getCityMap(mapType, provinceId) {
    const res = await this.invoke('getCityMap', [mapType, provinceId]);
    return res;
  }

  /**
   * 获取地区映射列表
   *
   * @see https://doc.qima-inc.com/pages/viewpage.action?pageId=6819929
   * @param {string} mapType
   * @param {string} cityId
   * @return {Promise<Object>}
   */
  async getCountyMap(mapType, cityId) {
    const res = await this.invoke('getCountyMap', [mapType, cityId]);
    return res;
  }
}

module.exports = RegionService;
