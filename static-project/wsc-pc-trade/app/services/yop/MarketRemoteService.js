const BaseService = require('../base/BaseService');

/**
 * 商业化相关接口
 */
class MarketRemoteService extends BaseService {
  /**
   * SERVICE_NAME
   * @return {string}
   * @constructor
   */
  get SERVICE_NAME() {
    return 'com.youzan.yop.api.MarketRemoteService';
  }

  /**
   *  根据多种条件查询订单列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/2622
   *
   *  @param {object} param
   *  @param {number} param.kdtId - 店铺id
   *  @param {number} param.orderId - 订单id
   *  @param {number} param.appGroup - 应用分组
   *  @param {Array<number>} param.filterAppIds - 需过滤的订单的appId列表
   *  @param {number} param.appId - 应用id
   *  @param {boolean} param.isFilter - 是否过滤部分appId的订单 默认情况下不会存在过滤(目前, 只有微商城订购零售时, 零售订单未付款, 则前端要隐藏)
   *  @param {Array<number>} param.filterStates - 需过滤的订单的状态
   *  @param {number} param.pageSize - 分页查询参数大小
   *  @param {number} param.state - 订单状态
   *  @param {string} param.beginTime - 查询订单创建开始时间
   *  @param {string} param.endTime - 查询订单创建结束时间
   *  @param {number} param.pageNum - 分页查询参数页
   *  @return {Promise<any>}
   */
  async listOrderV2(param) {
    return this.invoke('listOrderV2', [param]);
  }
}

module.exports = MarketRemoteService;
