const BaseService = require('./ShopBaseService');
/**
 *com.youzan.shopcenter.outer.service.address.ShopAddressOuterService
 */
class ShopAddressOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.address.ShopAddressOuterService';
  }

  /**
   *  查询店铺地址列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/408969
   *
   *  @param {Object} request - {@link ShopAddressPageQueryRequest}
   *  @param {Array.<Array>} request.addressTypeValues[] -
   *  @param {Array} request.addressTypeValues[] -
   *  @param {number} request.kdtId -
   *  @param {number} request.pageSize - 分页大小
   *  @param {string} request.keyword -
   *  @param {number} request.pageNum - 页码
   *  @return {Promise}
   */
  async queryShopAddressList(request) {
    return this.invoke('queryShopAddressList', [request]);
  }
}

module.exports = ShopAddressOuterService;
