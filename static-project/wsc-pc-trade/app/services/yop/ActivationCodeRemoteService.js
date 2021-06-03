const BaseService = require('../base/BaseService');

/**
 *  激活码相关
 *  com.youzan.yop.api.ActivationCodeRemoteService
 */
class ActivationCodeRemoteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.yop.api.ActivationCodeRemoteService';
  }

  /**
   *  激活码校验（新接口）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/113078
   *  https://doc.qima-inc.com/pages/viewpage.action?pageId=44048699
   *
   *  @param {Object} openActivationCodeCheckApi -
   *  @param {number} openActivationCodeCheckApi.kdtId -
   *  @param {string} openActivationCodeCheckApi.ip -
   *  @param {string} openActivationCodeCheckApi.activationCode -
   *  @param {number} openActivationCodeCheckApi.userId -
   *  @param {number} openActivationCodeCheckApi.categoryId - 激活码类别，兼容iron，
   *  @return {Promise}
   */
  async checkCodeForNew(openActivationCodeCheckApi) {
    return this.invoke('checkCodeForNew', [openActivationCodeCheckApi]);
  }

  /**
   *  激活码使用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/19507
   *
   *  @param {Object} openActivationCodeApplyApi -
   *  @param {number} openActivationCodeApplyApi.kdtId -
   *  @param {string} openActivationCodeApplyApi.ip -
   *  @param {string} openActivationCodeApplyApi.activationCode -
   *  @param {number} openActivationCodeApplyApi.userId -
   *  @return {Promise}
   */
  async codeApply(openActivationCodeApplyApi) {
    return this.invoke('codeApply', [openActivationCodeApplyApi]);
  }
}

module.exports = ActivationCodeRemoteService;
