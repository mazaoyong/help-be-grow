const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.ic.api.core.ProductFacade -  */
class ProductService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ic.api.core.ProductFacade';
  }

  /**
   *  通过Alias查询商品简要信息，不查商品中心
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/273832
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} aliases -
   *  @return {Promise}
   */
  async getSimpleByAliases(kdtId, aliases) {
    return this.invoke('getSimpleByAliases', [kdtId, aliases]);
  }
}

module.exports = ProductService;
