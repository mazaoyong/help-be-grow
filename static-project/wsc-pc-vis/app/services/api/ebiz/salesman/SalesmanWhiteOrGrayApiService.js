const BaseService = require('../../../base/BaseService');

/** com.youzan.ebiz.salesman.api.common.SalesmanWhiteOrGrayApiService -  */
class SalesmanWhiteOrGrayApiService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.salesman.api.common.SalesmanWhiteOrGrayApiService';
  }

  /**
   *  是否在销售员支持连锁白名单内
   *  原因:白名单可能也要兼容连锁逻辑 统一去做
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509897
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async isInChainGrayReleaseByKdtId(kdtId) {
    return this.invoke('isInChainGrayReleaseByKdtId', [kdtId]);
  }
}

module.exports = SalesmanWhiteOrGrayApiService;
