const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.ump.api.collectzan.CollectZanFacade -  */
class CollectZanFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.collectzan.CollectZanFacade';
  }

  /**
   *  C端发起集赞
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/278496
   *
   *  @param {number} kdtId -
   *  @param {Object} createZanSetCommand -
   *  @param {number} createZanSetCommand.fansId - 粉丝id
   *  @param {number} createZanSetCommand.zanId - 集赞id
   *  @param {number} createZanSetCommand.adminId - 用户id
   *  @param {string} createZanSetCommand.productAlias - 商品alias
   *  @param {number} createZanSetCommand.fansType - 粉丝类型
   *  @return {Promise}
   */
  async buildZanSet(kdtId, createZanSetCommand) {
    return this.owlInvoke('buildZanSet', [kdtId, createZanSetCommand]);
  }

  /**
   *  C端查询发起的集赞详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/278497
   *
   *  @param {Object} zanSetQuery -
   *  @param {number} zanSetQuery.fansId - 粉丝id
   *  @param {number} zanSetQuery.adminId - 用户id
   *  @param {string} zanSetQuery.zanSetAlias - 发起的集赞alias
   *  @param {number} zanSetQuery.fansType - 粉丝类型
   *  @return {Promise}
   */
  async getZanSetDetail(zanSetQuery) {
    return this.owlInvoke('getZanSetDetail', [zanSetQuery]);
  }

  /**
   *  C端点赞
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/278498
   *
   *  @param {number} kdtId -
   *  @param {Object} createGivingZanCommand -
   *  @param {number} createGivingZanCommand.fansId - 粉丝id
   *  @param {number} createGivingZanCommand.zanSetId - 发起的集赞id
   *  @param {number} createGivingZanCommand.zanId - 集赞id
   *  @param {number} createGivingZanCommand.adminId - 用户id
   *  @param {number} createGivingZanCommand.fansType - 粉丝类型
   *  @return {Promise}
   */
  async givingZan(kdtId, createGivingZanCommand) {
    return this.owlInvoke('givingZan', [kdtId, createGivingZanCommand]);
  }
}

module.exports = CollectZanFacade;
