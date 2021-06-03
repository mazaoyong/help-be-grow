const BaseService = require('../base/BaseService');

/**
 * SelfFetchService
 */
class SelfFetchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.delivery.service.SelfFetchService';
  }

  /**
   *  查询自提时间设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/142122
   *
   *  @param {Object} param - 自提时间查询参数, kdtId, offlineId 都是必填
   *  @param {number} param.kdtId - 口袋通id，有赞内部必填，必须唯一，用于结算运费
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @param {number} param.offlineId - 门店编码, 自提点编码, 必填
   *  @return {Promise}
   */
  async getSelfFetchTime(param) {
    return this.invoke('getSelfFetchTime', [param]);
  }

  /**
   * 设置自提时间
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/142120
   *
   * @param {Object} param - 自提时间设置参数
   * @param {boolean} param.isOpen - 买家是否需要选择时间
   * @param {string} param.aheadMinType - 提前预约时间类型, DAY 天; HOUR 小时；MINUTE 分钟
   * @param {string} param.aheadMaxType - 最多提前几天下订单, 类型, 默认 DAY
   * @param {number} param.kdtId - 口袋通客户ID
   * @param {string} param.fromApp - 请求来源app
   * @param {string} param.requestId - UUID
   * @param {number} param.offlineId - 自提点id
   * @param {number} param.aheadMin - 提前预约时间数量
   * @param {string} param.timeSpan - 送达时段细分 DAY 天；MEAL 上午下午晚上； HOUR 小时；HALFHOUR 半小时
   * @param {number} param.aheadMax - 最多提前几天下订单, 仅限当天：0
   * @param {Array.<Object>} param.timeBucket - 营业时间周期，2进制表示7天的开关，第一位是周一
   * @return {Promise}
   */
  async setSelfFetchTimeConfig(param) {
    return this.invoke('setSelfFetchTimeConfig', [param]);
  }
}

module.exports = SelfFetchService;
