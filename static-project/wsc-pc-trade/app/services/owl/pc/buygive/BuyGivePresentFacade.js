const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.buygive.BuyGivePresentFacade -  */
class BuyGivePresentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.buygive.BuyGivePresentFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509548
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询条件
   *  @param {string} query.orderNo - 订单号
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Array<Object>} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, query, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, query, pageRequest]);
  }
}

module.exports = BuyGivePresentFacade;
