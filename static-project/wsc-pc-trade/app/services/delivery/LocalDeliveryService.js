const BaseService = require('../base/BaseService');

/**
 * com.youzan.ic.delivery.service.LocalDeliveryService
 */
class LocalDeliveryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.LocalDeliveryService';
  }

  /**
   *  同城配送多区域设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/79837
   *  @param {Object} config - 请求参数
   *  @param {number} config.updatedTime - 最后更新时间，为了数据迁移临时加，后期去掉
   *  @param {string} config.aheadMaxType - 最多提前几天下订单, 类型, 默认 DAY
   *  @param {number} config.lng - 店铺径度
   *  @param {number} config.kdtId - 口袋通客户ID
   *  @param {string} config.fromApp - 请求来源app
   *  @param {number} config.aheadMin - 订单开始的偏移量
   *  @param {Array.<Object>} config.areaParamList[] - 同城配送区域配置
   *  @param {boolean} config.isOpen - 开启定时达功能
   *  @param {string} config.aheadMinType - 订单结束的偏移量   目前默认单位：DAY 日；HOUR 小时；HALFHOUR分钟
   *  @param {string} config.requestId - UUID
   *  @param {number} config.offlineId - 门店id
   *  @param {string} config.timeSpan - 送达时间细分 DAY 天；MEAL 上午下午晚上； HOUR 小时；HALFHOUR 半小时
   *  @param {number} config.aheadMax - 最长预约时间,最多提前几天下订单, 仅限当天：0
   *  @param {Array.<Object>} config.timeBucket - 营业时间周期，2进制表示7天的开关，第一位是周一
   *  @param {number} config.id -
   *  @param {number} config.lat - 店铺纬度
   *  @return {Promise}
   */
  async setConfigV2(config) {
    return this.invoke('setConfigV2', [config]);
  }

  /**
   * @typedef {import('definitions/local-delivery/config').IConfig} IConfig
   */

  /**
   *  获取同城派送设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/80779
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} offlineId - 多网点id
   *  @return {Promise<IConfig>}
   */
  async getConfigV2(kdtId, offlineId) {
    return this.invoke('getConfigV2', [kdtId, offlineId]);
  }
  /**
   *  获取同城派送设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/446333
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @param {number} param.offlineId - 门店id
   *  @param {number} param.headId - 总店id
   *  @return {Promise}
   */
  async getConfigV2New(param) {
    return this.invoke('getConfigV2', [param]);
  }
}

module.exports = LocalDeliveryService;
