const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class StateTransferService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.StateTransferFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/405939
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.clueId - 线索 id
   *  @param {number} command.targetStateCode - 目标状态
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async changeState(kdtId, command) {
    return this.invoke('changeState', [kdtId, command]);
  }
}

module.exports = StateTransferService;
