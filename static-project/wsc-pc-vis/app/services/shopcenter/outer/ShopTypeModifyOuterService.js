const BaseService = require('../../base/BaseService');

/** com.youzan.shopcenter.outer.service.shop.ShopTypeModifyOuterService -  */
class ShopTypeModifyOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopTypeModifyOuterService';
  }

  /**
   *  查询可更换店铺类型的店铺列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/366623
   *
   *  @param {Object} request - {@link ModifiableShopPageQueryRequest}
   *  @param {number} request.accountId -
   *  @param {Array.<Array>} request.shopTypes[] -
   *  @param {Array} request.shopTypes[] -
   *  @param {number} request.pageSize - 分页大小
   *  @param {number} request.pageNum - 页码
   *  @return {Promise}
   */
  async queryModifiableShops(request) {
    return this.invoke('queryModifiableShops', [request]);
  }
}

module.exports = ShopTypeModifyOuterService;
