const SelfFetchBaseService = require('./SelfFetchBaseService');
/**
 * 自提点相关
 */
class SelfFetchSettingService extends SelfFetchBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.setting.SelfFetchSettingService';
  }
  /**
   *  查询自提设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/141475
   *
   *  @param {number} kdtId -
   *  @param {number} storeId -
   *  @return {Promise}
   */
  async get(kdtId, storeId) {
    return this.invoke('get', [kdtId, storeId]);
  }
  /**
   *  更新自提设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/141476
   *
   *  @param {Object} request -
   *  @param {boolean} request.isOpen - 买家是否需要选择时间
   *  @param {string} request.aheadMinType - 提前预约时间类型, DAY 天; HOUR 小时；MINUTE 分钟
   *  {@link com.youzan.delivery.constants.LocalDeliveryAheadEnum}
   *  @param {string} request.aheadMaxType - 最多提前几天下订单, 类型, 默认 DAY
   *  @param {number} request.kdtId - 口袋通客户ID
   *  @param {number} request.offlineId - 自提点id
   *  @param {number} request.aheadMin - 提前预约时间数量
   *  @param {string} request.timeSpan - 送达时段细分 DAY 天；MEAL 上午下午晚上； HOUR 小时；HALFHOUR 半小时
   *  {@link com.youzan.delivery.constants.LocalDeliveryTimespanEnum}
   *  @param {number} request.aheadMax - 最多提前几天下订单, 仅限当天：0
   *  @param {Array.<Object>} request.timeBucket[] - 营业时间周期，2进制表示7天的开关，第一位是周一
   *  @param {Object} request.operator - 操作人
   *  @return {Promise}
   */
  async update(request) {
    return this.invoke('update', [request]);
  }
}

module.exports = SelfFetchSettingService;
