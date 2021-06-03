const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.quicksettle.QuickSettlePCFacade -  */
class QuickSettlePCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.quicksettle.QuickSettlePCFacade';
  }

  /**
   *  服务准入校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510868
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async serviceCheck(kdtId) {
    return this.invoke('serviceCheck', [kdtId]);
  }

  /**
   *  查询服务数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510871
   *
   *  @param {number} kdtId -
   *  @param {Object} request - 操作记录分页参数
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @return {Promise}
   */
  async listRecordsWithService(kdtId, request) {
    return this.invoke('listRecordsWithService', [kdtId, request]);
  }

  /**
   *  提交申请加入服务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510869
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.operatorType - 操作类型 1 申请 2 撤销 {@link com.youzan.owl.goingmerry.api.enums.quicksettle.OperatorRecordType}
   *  @param {Object} command.operator -
   *  @return {Promise}
   */
  async applyQuickSettleService(kdtId, command) {
    return this.invoke('applyQuickSettleService', [kdtId, command]);
  }

  /**
   *  撤销申请加入服务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/510870
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.operatorType - 操作类型 1 申请 2 撤销 {@link com.youzan.owl.goingmerry.api.enums.quicksettle.OperatorRecordType}
   *  @param {Object} command.operator -
   *  @return {Promise}
   */
  async cancelQuickSettleService(kdtId, command) {
    return this.invoke('cancelQuickSettleService', [kdtId, command]);
  }
}

module.exports = QuickSettlePCFacade;
