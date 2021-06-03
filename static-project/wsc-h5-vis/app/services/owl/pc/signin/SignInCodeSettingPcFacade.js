/* com.youzan.owl.pc.api.signin.SignInCodeSettingPcFacade -  */
const BaseService = require('../../../base/BaseService');

class SignInCodeSettingPcFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignInCodeSettingPcFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/355652
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async get(kdtId) {
    return this.owlInvoke('get', [kdtId]);
  }
}

module.exports = SignInCodeSettingPcFacade;
