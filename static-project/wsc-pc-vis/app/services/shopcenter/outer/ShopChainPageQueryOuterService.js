const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.outer.service.chain.ShopChainPageQueryOuterService -  */
class ShopChainPageQueryOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.chain.ShopChainPageQueryOuterService';
  }

  /**
   *  分页查询某店铺下所有的后代节点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/197922
   *
   *  @param {Object} request - 查询请求 {@link ShopNodePageQueryRequest}
   *  @param {number} request.kdtId - 当前节点kdtId
   *  @param {Array.<Array>} request.shopRoles[] - 店铺角色，必填
   *  @param {Array} request.shopRoles[] -
   *  @param {boolean} request.isOfflineShopOpenForSubShop - 是否开启线下店
   *  @param {number} request.pageSize - 分页大小，最大50
   *  @param {number} request.pageNum - 页码，最小为1
   *  @param {boolean} request.isOnlineShopOpenForSubShop - 是否开启线上店
   *  @return {Promise}
   */
  async queryDescendentShopNodes(request) {
    return this.invoke('queryDescendentShopNodes', [request]);
  }
}

module.exports = ShopChainPageQueryOuterService;
