/* com.youzan.owl.pc.api.clue.plat.CluePlatMergeFacade -  */
const BaseService = require('../../../base/BaseService');

class CluePlatMergeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.plat.CluePlatMergeFacade';
  }

  /**
   *  查询是否可合并对象
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/820332
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.identityNo - 身份标识号
   *  @param {number} query.clueId - 兼容线索学员改造期间数据
   *  @return {Promise}
   */
  async checkClueMerge(kdtId, query) {
    return this.invoke('checkClueMerge', [kdtId, query]);
  }

  /**
   *  合并确认接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/820333
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.identityNo - 身份标识号
   *  @param {number} command.ownerUserId - 课程顾问id，为空则合并自动取值
   *  @param {string} command.targetIdentityNo - 转化目标标识号
   *  @return {Promise}
   */
  async confirmClueMerge(kdtId, command) {
    return this.invoke('confirmClueMerge', [kdtId, command]);
  }
}

module.exports = CluePlatMergeFacade;
