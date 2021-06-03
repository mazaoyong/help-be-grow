const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.ceres.CeresAdminPCFacade -  */
class CeresAdminPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ceres.CeresAdminPCFacade';
  }

  /**
   *  获取家校圈配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/730568
   *
   *  @param {number} kdtId -
   *  @param {string} user - 需要查询用户是否可以发送动态时，传入 user 参数
   *  @return {Promise}
   */
  async getCeresConfig(kdtId, user) {
    return this.invoke('getCeresConfig', [kdtId, user]);
  }
}

module.exports = CeresAdminPCFacade;
