const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.onlinecourse.ClientLiveFacade -  */
class ClientLiveFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientLiveFacade';
  }

  /**
   *  获取校区的alias
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/889744
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getCampusAlias(kdtId, alias) {
    return this.invoke('getCampusAlias', [kdtId, alias]);
  }
}

module.exports = ClientLiveFacade;
