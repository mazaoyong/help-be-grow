const BusinessBaseService = require('./BusinessBaseService');

/**
 * com.youzan.trade.business.gift.api.child.ChildOrderService
 */
class ChildOrderService extends BusinessBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.gift.api.child.ChildOrderService';
  }

  /**
   *  查询老的送礼自订单信息仅给trade-detail迁移服务化用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/922850
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.pageNo -
   *  @param {number} param.pageSize -
   *  @param {string} param.parentOrderNo - 父订单号
   *  @param {boolean} param.withChildAddress - 是否包含地址信息
   *  @return {Promise}
   */
  async queryChildOrderList(param) {
    return this.invoke('queryChildOrderList', [param]);
  }
}

module.exports = ChildOrderService;
