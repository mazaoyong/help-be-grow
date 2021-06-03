const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.ump.api.poster.PosterInstanceFacade -  */
class PosterInstanceFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.poster.PosterInstanceFacade';
  }

  /**
   *  海报粉丝用户匿名下单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/306502
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.fansId - 粉丝id
   *  @param {number} command.instanceId - 用户活动实例id
   *  @param {number} command.userId - 用户id
   *  @return {Promise}
   */
  async anonymousSub(kdtId, command) {
    return this.invoke('anonymousSub', [kdtId, command]);
  }
}

module.exports = PosterInstanceFacade;
