const BaseService = require('../../../base/BaseService');

// 线索操作
class ClueOperateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.ClueOperateFacade';
  }

  /**
   *  线索录入
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417330
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.sourceId - 线索来源id
   *  @param {Object} command.clueAddDistribute - 线索分配信息
   *  @param {string} command.name - 学员姓名
   *  @param {string} command.telephone - 学员手机号
   *  @param {Array.<Object>} command.attributes[] - 学员资料项
   *  @param {Object} command.operator - 线索操作人
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
    *  线索资料项更新接口
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421075
    *
    *  @param {number} kdtId -
    *  @param {Object} command -
    *  @param {Array.<Object>} command.attributes[] - 线索资料项；
清空已有资料项值，attrValue 传空字符串
    *  @param {number} command.clueId - 线索唯一主键id
    *  @param {Object} command.operator - 操作人
    *  @return {Promise}
    */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  线索标签更新接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/405951
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {Array.<Array>} command.tagIds[] - 全部标签id列表,清空标签传空数组
   *  @param {number} command.clueId - 线索id
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async updateClueTags(kdtId, command) {
    return this.invoke('updateClueTags', [kdtId, command]);
  }

  /**
   *  批量转让线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/402424
   *
   *  @param {number} kdtId -
   *  @param {Object} clueCommand -
   *  @param {string} clueCommand.reason - 转让原因
   *  @param {number} clueCommand.targetUserId - 线索接收人
   *  @param {Array.<Array>} clueCommand.clueId[] - 转让线索 id
   *  @param {Object} clueCommand.operator - 操作人
   *  @return {Promise}
   */
  async transferClues(kdtId, clueCommand) {
    return this.invoke('transferClues', [kdtId, clueCommand]);
  }

  /**
   *  批量放弃线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/402425
   *
   *  @param {number} kdtId - 当前操作的 kdtId
   *  @param {Object} command -
   *  @param {string} command.reason -
   *  @param {Array.<Array>} command.clueIds -
   *  @param {Object} command.operator -
   *  @return {Promise}
   */
  async giveUpClues(kdtId, command) {
    return this.invoke('giveUpClues', [kdtId, command]);
  }

  /**
   *  批量删除线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/489252
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.reason - 操作原因
   *  @param {Array.<Array>} command.clueIds[] -
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async deleteClues(kdtId, command) {
    return this.invoke('deleteClues', [kdtId, command]);
  }

  /**
   *  批量还原线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/489254
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.reason - 操作原因
   *  @param {number} command.restoreType - 还原类型 0: 进入公海池 1：分配给员工
   *  @param {Array.<Array>} command.clueIds[] -
   *  @param {number} command.userId - 员工id
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async restoreClues(kdtId, command) {
    return this.invoke('restoreClues', [kdtId, command]);
  }

  /**
   *  永久删除线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/489253
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.reason - 操作原因
   *  @param {Array.<Array>} command.clueIds[] -
   *  @param {Object} command.operator - 操作人
   *  @return {Promise}
   */
  async permanentlyDeleteClues(kdtId, command) {
    return this.invoke('permanentlyDeleteClues', [kdtId, command]);
  }

  /**
   *  修改线索状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417333
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.clueId - 线索 id
   *  @param {number} command.targetStateCode - 目标状态
   *  @param {Object} command.operator - 操作人
   *  @param {string} command.relatedOrderNo - 关联订单号 非必填 当线索完成时需要
   *  @return {Promise}
   */
  async changeState(kdtId, command) {
    return this.invoke('changeState', [kdtId, command]);
  }

  /**
   *  线索分配
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/408272
   *
   *  @param {number} kdtId - 当前操作的 kdtId
   *  @param {Object} command -
   *  @param {number} command.targetKdtId - 目标 kdt
   *  @param {Array.<Array>} command.clueIds[] - 被分配线索
   *  @param {number} command.receiveType - 接收方类型 1 公海池 2 个人
   *  @param {number} command.userId - 接收方 id
   *  @param {Object} command.operator - 操作人
   *  @param {number} command.kdtType - 校区类型 1 总部 2 校区
   *  @return {Promise}
   */
  async distributeClues(kdtId, command) {
    return this.invoke('distributeClues', [kdtId, command]);
  }

  /**
   *  领取线索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/408273
   *
   *  @param {number} kdtId - 当前操作的 kdtId
   *  @param {Object} command -
   *  @param {Array.<Array>} command.clueIds[] -
   *  @param {Object} command.operator -
   *  @return {Promise}
   */
  async takeClues(kdtId, command) {
    return this.invoke('takeClues', [kdtId, command]);
  }
}

module.exports = ClueOperateFacade;
