const BaseService = require('../../../base/BaseService');
/**
 * 当日结算
 */
class SameDaySettlementService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.sameday.settlement.SameDaySettlementService';
  }

  /**
   *  申请当日结算
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/832756
   *
   *  @param {Object} addParam - 添加店铺
   *  @param {number} addParam.kdtId - 店铺id
   *  @param {number} addParam.operateId - 操作人id
   *  @return {Promise}
   */
  async application(addParam) {
    return this.invoke('application', [addParam]);
  }

  /**
   *  查看店铺当前申请状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/832757
   *
   *  @param {Object} queryParam - 查询参数
   *  @param {number} queryParam.kdtId - 店铺
   *  @return {Promise}
   */
  async queryApplicationStatus(queryParam) {
    return this.invoke('queryApplicationStatus', [queryParam]);
  }

  /**
   *  退出同城送当日结算逻辑
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/832758
   *
   *  @param {Object} quitParam - 退出入参
   *  @param {number} quitParam.kdtId - 店铺id
   *  @param {number} quitParam.operateId - 操作人
   *  @return {Promise}
   */
  async quit(quitParam) {
    return this.invoke('quit', [quitParam]);
  }
}

module.exports = SameDaySettlementService;
