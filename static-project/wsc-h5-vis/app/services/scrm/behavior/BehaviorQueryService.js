const BaseService = require('../../base/BaseService');

/* com.youzan.scrm.api.credit.points.PointsReadService -  */
class BehaviorQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.behavior.base.service.BehaviorQueryService';
  }

  /**
   *  拼团订单判断是否是老客定义
   *  zanAPI http://zanapi.qima-inc.com/site/service/view/736434
   *  @param {object} groupCustomerRequest
   *  @param {number} groupCustomerRequest.kdtId 店铺ID
   *  @param {number} groupCustomerRequest.userId 用户ID
   *  @param {string[]} orderFromSet 订单来源
   *  @param {string[]} orderBiz2ScrmSet 订单对应的系统消息类型
  */

  async hasBookedOrder(groupCustomerRequest) {
    return this.invoke('hasBookedOrder', [groupCustomerRequest]);
  }
}

module.exports = BehaviorQueryService;
