const BaseService = require('./DeliveryBaseService');

/**
 * @class DeliverySettingService
 * @extends {BaseService}
 */
class DeliverySettingService extends BaseService {
  /**
   * @readonly
   * @memberof DeliveryOrderExpressService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.DeliverySettingService';
  }

  /**
   * 获取物流设置开关
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/84583
   *
   * @param {object} param -
   * @param {string} param.fromApp - 请求来源app
   * @param {number} param.kdtId - 店铺id
   * @param {string} param.requestId - UUID
   * @return {object}
   */
  async getSettingV3(param) {
    return this.invoke('getSettingV3', [param]);
  }

  /**
   *  更新同城配送的开关
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/19240
   *
   *  @param {Object} param - 需要更新的物流开关，同城配送、快递、自提至少开启一个。
   *  @param {number} param.kdtId - 口袋通id
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @param {number} param.offlineId - 门店id
   *  @param {number} param.calcType - 计费类型 0：各个运费模板独立计算首重续重加合计算模式, 1：按模板分组获取最大首重，其余按续重计算、合并统一运费计算最大值（物流最小的问题
   *  @param {boolean} param.isExpress - 是否支持快递
   *  @param {boolean} param.isSelf - 是否支持自提
   *  @param {boolean} param.isLocal - 是否支持同城
   *  @return {Promise}
   */
  async updateSetting(param) {
    return this.invoke('updateSetting', [param]);
  }

  /**
   *  批量查询物流设置接口, 按店铺id 查询是否支持同城配送、自提、快递、是否支持同城定时达以及计费类型
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/84584
   *
   *  @param {Object} param - 查询参数,其中 kdtIds 最多支持 20 个
   *  @param {Array.<Array>} param.kdtIds[] - 店铺id（总店或仓都可以），最多支持 20 个
   *  @param {Array} param.kdtIds[] -
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @return {Promise}
   */
  async getSettings(param) {
    return this.invoke('getSettings', [param]);
  }
}

module.exports = DeliverySettingService;
