const BaseService = require('../../../base/BaseService');

class ProductPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.course.ProductPCFacade';
  }

  /**
   * @description 查询商品列表信息,包含sku信息(默认按照传入的商品id顺序)
   * @link http://zanapi.qima-inc.com/site/service/view/946954
   */
  async findProductsWithSku(kdtId, query) {
    return this.invoke('findProductsWithSku', [kdtId, query]);
  }
};

module.exports = ProductPCFacade;
