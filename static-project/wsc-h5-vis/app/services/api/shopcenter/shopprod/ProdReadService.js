const BaseService = require('../../../base/BaseService');

/** com.youzan.shopcenter.shopprod.api.service.prod.ProdReadService -  */
class ProdReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopprod.api.service.prod.ProdReadService';
  }

  /**
   *  查询单个店铺产品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/518031
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise}
   */
  async queryShopProd(kdtId) {
    return this.invoke('queryShopProd', [kdtId], { cache: 30 });
  }

  /**
   *  查询店铺产品版本
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/323215
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise}
   */
  async queryShopProdVersions(kdtId) {
    return this.invoke('queryShopProdVersions', [kdtId], { cache: 30 });
  }
}

module.exports = ProdReadService;
