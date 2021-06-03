const BaseService = require('../../../base/BaseService');
/** com.youzan.owl.ic.api.core.ProductFacade -  */
class ProductFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ic.api.core.ProductFacade';
  }

  /**
   *  通过Alias查询商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/239924
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getByAlias(kdtId, alias) {
    return this.invoke('getByAlias', [kdtId, alias]);
  }

  /**
   * 通过Alias查询商品SKU
   *
   * @param {*} kdtId
   * @param {*} alias
   */
  async getSkuByAlias(kdtId, alias) {
    return this.invoke('listSkusByAlias', [kdtId, alias]);
  }
}

module.exports = ProductFacade;
