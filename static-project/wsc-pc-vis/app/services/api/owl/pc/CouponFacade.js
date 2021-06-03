const BaseService = require('../../../base/BaseService');

class CouponFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.livemarketing.LiveCouponFacade';
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/942490 */
  async findCouponList(operatorKdtId, liveCouponQuery) {
    return this.invoke('findCouponList', [operatorKdtId, liveCouponQuery]);
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/942488 */
  async createCoupon(operatorKdtId, liveCouponCreateCommand) {
    return this.invoke('createCoupon', [operatorKdtId, liveCouponCreateCommand]);
  }

  /** @link http://zanapi.qima-inc.com/site/service/view/942489 */
  async deleteCoupon(operatorKdtId, liveCouponDeleteCommand) {
    return this.invoke('deleteCoupon', [operatorKdtId, liveCouponDeleteCommand]);
  }
}

module.exports = CouponFacade;
