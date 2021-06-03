const BaseService = require('../../../base/BaseService');

/**
 *
 * @class OfflineEnrollmentGatherFacade
 * @extends {BaseService}
 */
class OfflineEnrollmentGatherFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.offlineenrollment.OfflineEnrollmentGatherFacade';
  }

  /**
   *  根据订单号查询支付凭证
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/439176
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @return {Promise}
   */
  async findGiveAwayByOrderNo(kdtId, orderNo) {
    return this.invoke('findGiveAwayByOrderNo', [kdtId, orderNo]);
  }

  /**
   *  根据订单号查询赠品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1093148
   *
   *  @param {number} kdtId -
   *  @param {string} offlineGiveAwayQuery -
   *  @return {Promise}
   */
  async findGiveAway(kdtId, offlineGiveAwayQuery) {
    return this.invoke('findGiveAway', [kdtId, offlineGiveAwayQuery]);
  }
}

module.exports = OfflineEnrollmentGatherFacade;
