const BaseService = require('../base/BaseService');

/**
 * com.youzan.secured.SecuredService
 */
class SecuredService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.secured.SecuredService';
  }

  /**
   *  查询有赞担保服务状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/3015
   *
   *  @param {Object} request -
   *  @param {number} request.mchId - 商户号
   *  @param {number} request.kdtId - 店铺ID
   *  @param {string} request.requestId -
   *  @param {number} request.operatorId - 操作人员id
   *  @return {Promise}
   */
  async query(request) {
    return this.invoke('query', [request]);
  }
}

module.exports = SecuredService;
