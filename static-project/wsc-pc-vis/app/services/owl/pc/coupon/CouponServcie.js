const BaseService = require('../../../base/BaseService');

class CouponService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.coupon.CouponFacade';
  }

  /**
   *  查询店铺下所有优惠券列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/441863
   *
   *  @param {number} kdtId -
   *  @param {Object} shopCouponQuery -
   *  @param {boolean} shopCouponQuery.isSuperStore - 是否是超级门店
   *  @param {string} shopCouponQuery.source - 来源
   *  @return {Promise}
   */
  async findAllValidCouponListByKdtId(kdtId, shopCouponQuery) {
    return this.invoke('findAllValidCouponListByKdtId', [
      kdtId,
      shopCouponQuery,
    ]);
  }
}

module.exports = CouponService;
