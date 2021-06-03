/* com.youzan.owl.api.client.edu.signin.SignInCodeSettingFacade -  */
const BaseService = require('../../../../base/BaseService');

class SignInCodeSettingFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.signin.SignInCodeSettingFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364800
   *
   *  @param {number} kdtId -
   *  @param {number} scene -
   *  @return {Promise}
   */
  async get(kdtId, scene) {
    return this.invoke('get', [kdtId, scene]);
  }
}

module.exports = SignInCodeSettingFacade;
