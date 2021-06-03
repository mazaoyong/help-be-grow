const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.onlinecourse.LiveVideoFacade -  */
class LiveVideoFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.LiveVideoFacade';
  }

  /**
   *  查询直播链接
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/720964
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} liveLinkQuery - 直播链接查询参数
   *  @param {string} liveLinkQuery.alias - 商品别名
   *  @param {number} liveLinkQuery.userId - 用户ID
   *  @return {Promise}
   */
  async getLiveLink(kdtId, liveLinkQuery) {
    return this.invoke('getLiveLink', [kdtId, liveLinkQuery]);
  }
}

module.exports = LiveVideoFacade;
