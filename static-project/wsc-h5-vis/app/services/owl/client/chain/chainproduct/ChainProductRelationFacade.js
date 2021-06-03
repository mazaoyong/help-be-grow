const BaseService = require('../../../../base/BaseService');

class ChainProductRelationFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.chain.chainproduct.ChainProductRelationFacade';
  }

  /**
   *  通过校区alias获取另一所校区商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421339
   *
   *  @param {Object} query - 查询实体
   *  @param {number} query.sourceKdtId - 来源校区店铺id
   *  @param {number} query.targetKdtId - 目标校区店铺id
   *  @param {string} query.sourceProductAlias - 来源校区商品alias
   *  @return {Promise}
   */
  async getCampusProductByCampus(query) {
    return this.invoke('getCampusProductByCampus', [query]);
  }
}

module.exports = ChainProductRelationFacade;
