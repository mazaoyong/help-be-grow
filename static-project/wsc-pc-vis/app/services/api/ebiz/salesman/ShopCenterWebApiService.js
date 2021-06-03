const BaseService = require('../../../base/BaseService');

/** com.youzan.ebiz.salesman.web.api.v3.service.common.ShopCenterWebApiService -  */
class ShopCenterWebApiService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.salesman.web.api.v3.service.common.ShopCenterWebApiService';
  }

  /**
   *  根据kdtId获取店铺的类型
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/488458
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async getShopTypeByKdtId(kdtId) {
    return this.invoke('getShopTypeByKdtId', [kdtId]);
  }

  /**
             *  连锁模式下获取总店的下级子节点
  只展示网店和门店
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/488459
  *
             *  @param {number} kdtId - 店铺id
             *  @return {Promise}
             */
  async getDescendantShopNodes(kdtId) {
    return this.invoke('getDescendantShopNodes', [kdtId]);
  }

  /**
   *  根据kdtId获取店铺的类型 原始的数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/522593
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async getOriginShopTypeByKdtId(kdtId) {
    return this.invoke('getOriginShopTypeByKdtId', [kdtId]);
  }
}

module.exports = ShopCenterWebApiService;
