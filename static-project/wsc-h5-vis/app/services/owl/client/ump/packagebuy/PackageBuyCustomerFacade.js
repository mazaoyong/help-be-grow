const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.ump.packagebuy.PackageBuyCustomerFacade -  */
class PackageBuyCustomerFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.packagebuy.PackageBuyCustomerFacade';
    // return 'com.youzan.owl.ump.sunny.api.activity.packagebuy.PackageBuyCustomerFacade';
  }

  /**
   *  根据商品查询可以参加的活动信息详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/468915
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 活动查询条件
   *  @param {string} query.activityAlias - 活动的alias 二选其一
   *  @param {number} query.userId - 用户Id 可以为空
   *  @param {string} query.productAlias - 商品的alias 二选其一
   *  @return {Promise}
   */
  async listActivityDetail(kdtId, query) {
    return this.invoke('listActivityDetail', [kdtId, query]);
  }

  /**
   *  查询商品的所有sku信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471613
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} packageBuySkuQuery -
   *  @param {number} packageBuySkuQuery.activityId - 活动ID
   *  @param {string} packageBuySkuQuery.productAlias - 商品alias
   *  @return {Promise}
   */
  async getGoodsAllSku(kdtId, packageBuySkuQuery) {
    return this.invoke('getGoodsAllSku', [kdtId, packageBuySkuQuery]);
  }
}

module.exports = PackageBuyCustomerFacade;
