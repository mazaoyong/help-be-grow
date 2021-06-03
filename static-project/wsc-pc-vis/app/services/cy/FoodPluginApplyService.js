const BaseService = require('../base/BaseService');

/**
 * @class FoodPluginApplyService
 * @extends {BaseService}
 */
class FoodPluginApplyService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.rigel.api.eatinorder.service.FoodPluginApplyService';
  }

  /**
   * 餐饮订购
   *
   * @param {Object} data
   * @param {string} data.province
   * @param {string} data.city
   * @param {string} data.count
   * @param {string} data.areaCode
   * @param {string} data.shopName
   * @param {string} data.contact
   * @param {string} data.mobile
   * @param {number} data.yzUsage
   * @return {Object}
   */
  async apply(data) {
    return this.invoke('apply', [data]);
  }
}

module.exports = FoodPluginApplyService;
