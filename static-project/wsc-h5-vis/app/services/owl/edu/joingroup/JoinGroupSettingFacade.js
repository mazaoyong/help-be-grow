const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.edu.api.joingroup.JoinGroupSettingFacade -  */
class JoinGroupSettingFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.joingroup.JoinGroupSettingFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/527702
   *
   *  @param {number} kdtId -
   *  @param {string} targetAlias -
   *  @return {Promise}
   */
  async get(kdtId, targetAlias) {
    return this.invoke('get', [kdtId, targetAlias]);
  }
}

module.exports = JoinGroupSettingFacade;
