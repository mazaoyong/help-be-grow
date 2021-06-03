const BaseService = require('../base/BaseService');

/**
 * 多网店自提点
 */
class SelfFetchPointService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.serivce.store.SelfFetchPointService';
  }

  /**
   *  根据kdtId查询零售店铺是否有自提点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/102842
   *
   *  @param {number} kdtId - 口袋通id
   *  @return {Promise}
   */
  async hasSelfFetchPoints(kdtId) {
    return this.invoke('hasSelfFetchPoints', [kdtId]);
  }
}

module.exports = SelfFetchPointService;
