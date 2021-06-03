const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.client.product.ClientContentProductFacade -  */
class ClientContentProductFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.product.ClientContentProductFacade';
  }

  /**
   *  根据alias查询contentproduct信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/551034
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getByAlias(kdtId, alias) {
    return this.invoke('getByAlias', [kdtId, alias]);
  }
}

module.exports = ClientContentProductFacade;
