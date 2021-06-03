const BaseService = require('../../base/BaseService');

interface BuyerInfoQueryDTO {
  fansId: number;
  kdtId: number;
  adminId: number;
  userId: number;
}

/* com.youzan.owl.api.SubscriptionService -  */
class SubscriptionService extends BaseService {
  get SERVICE_NAME() {
    return "com.youzan.owl.api.SubscriptionService";
  }

  /**
   *  根据userid或fansid查询买家在客户中心的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136217
   *
   *  @param {Object} buyerInfoQueryDTO -
   *  @param {number} buyerInfoQueryDTO.fansId -
   *  @param {number} buyerInfoQueryDTO.kdtId -
   *  @param {number} buyerInfoQueryDTO.adminId - 兼容卡门接口，实质就是buyerId
   *  @param {number} buyerInfoQueryDTO.userId -
   *  @return {Promise}
   */
  async getBuyerInfoFromUserCenter(buyerInfoQueryDTO: BuyerInfoQueryDTO) {
    return this.invoke("getBuyerInfoFromUserCenter", [buyerInfoQueryDTO]);
  }
}

module.exports = SubscriptionService;
