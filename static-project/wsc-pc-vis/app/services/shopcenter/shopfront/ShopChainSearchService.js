const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.shopfront.api.service.chain.ShopChainSearchService -  */
class ShopChainSearchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.chain.ShopChainSearchService';
  }

  /**
   *  搜索后代店铺
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/416248
   *
   *  @param {Object} request - {@link DescendentShopSearchRequest}
   *  @param {string} request.sortName - 排序字段
   *  @param {number} request.hqKdtId - 总部kdtId
   *  @param {Array.<Array>} request.subKdtIdList[] - 指定店铺kdtId集合
   *  @param {string} request.shopName - 检索:店铺名称（支持模糊）
   *  @param {number} request.pageSize - 分页大小
   *  @param {string} request.managerKeyword - 检索:负责人账号or名称（支持模糊）
   *  @param {number} request.pageNum - 页码
   *  @param {Array.<Array>} request.shopLifecycleStatuses[] - 检索:店铺生命周期状态
   *  @param {number} request.sortType - 1 升序 2 降序
   *  @param {boolean} request.isRealTimeMode - 是否实时数据模式（强制走db）
   *  @param {number} request.adminId - 店铺管理员id
   *  @param {Array.<Array>} request.joinTypes - 检索:加盟类型
   *  @param {Array.<Array>} request.shopRoleList - 店铺角色列表
   *  @return {Promise}
   */
  async searchDescendentShop(request) {
    return this.invoke('searchDescendentShop', [request]);
  }
}

module.exports = ShopChainSearchService;
