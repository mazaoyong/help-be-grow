const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.edu.wechatgroupsetting.WeChatJoinGroupFacade -  */
class WeChatJoinGroupFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.wechatgroupsetting.WeChatJoinGroupFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/355532
   *
   *  @param {number} kdtId -
   *  @param {string} targetAlias -
   *  @return {Promise}
   */
  async get(kdtId, targetAlias) {
    return this.owlInvoke('get', [kdtId, targetAlias]);
  }
}

module.exports = WeChatJoinGroupFacade;
