const BaseService = require('../../base/BaseService');

/* com.youzan.shopcenter.shopprod.api.service.prod.ProdReadService -  */class ProdReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopprod.api.service.prod.ProdReadService';
  }

  /**
   *  查询店铺产品版本
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/323215
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise}
   */
  async queryShopProdVersions(kdtId) {
    return this.invoke('queryShopProdVersions', [kdtId]);
  }
}

module.exports = ProdReadService;
