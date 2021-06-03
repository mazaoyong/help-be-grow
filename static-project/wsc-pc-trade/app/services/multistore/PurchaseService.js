const BaseService = require('../base/BaseService');

/* com.youzan.multistore.center.api.service.PurchaseService -  */
/**
 * 多网点订购
 */
class PurchaseService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.service.PurchaseService';
  }

  /**
   *  根据店铺id获取多网点插件的版本号
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/222591
   *
   *  @param {integer} kdtId - 店铺id
   *  @return {object}
   */
  async getPluginVersionByKdtId(kdtId) {
    return this.invoke('getPluginVersionByKdtId', [kdtId]);
  }
}

module.exports = PurchaseService;
