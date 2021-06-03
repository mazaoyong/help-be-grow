const BaseService = require('../../base/BaseService');

/** com.youzan.shopcenter.outer.service.shop.ShopNameCheckOuterService -  */
class ShopNameCheckOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopNameCheckOuterService';
  }

  /**
   *  创建微商城教育版店铺名称校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/218815
   *
   *  @param {Object} request - 店铺名称校验请求
   *  @param {number} request.accountId - 操作人账号id
   *  @param {number} request.kdtId - 店铺kdtId
   *  @param {string} request.shopName - 店铺名称
   *  @return {Object}
   */
  async checkShopName4CreateWscEduShop(request) {
    return this.invoke('checkShopName4CreateWscEduShop', [request]);
  }

  /**
   * 创建连锁学校总店名称校验
   * http://zanapi.qima-inc.com/site/service/view/632595
   * @param {number} accountId
   * @param {number} kdtId
   * @param {string} shopName
   * @param {boolean} isCreateSingleShop
   * */
  async checkChainShopName({ accountId, kdtId, shopName, isCreateSingleShop }) {
    const shopRole = isCreateSingleShop ? 0 : 1;
    return this.invoke('checkCreateShopName', [{
      accountId,
      kdtId,
      shopName,
      shopRole,
      shopTopic: 1,
      saasSolution: null,
      shopType: 0,
    }]);
  }
}

module.exports = ShopNameCheckOuterService;
