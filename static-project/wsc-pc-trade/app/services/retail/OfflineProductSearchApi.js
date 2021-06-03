const BaseService = require('../base/BaseService');

/**
 * com.youzan.retail.product.search.api.service.OfflineProductSearchApi
 */
class OfflineProductSearchApi extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.product.search.api.service.OfflineProductSearchApi';
  }

  /**
   *  搜索接口，根据中文关键字模糊匹配
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10074
   *
   *  @param {object} request - 是否是虚拟商品
   *  @return {Promise<any>}
   */
  async search(request) {
    return this.invoke('search', [request]);
  }
}

module.exports = OfflineProductSearchApi;
