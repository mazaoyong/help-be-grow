const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.ump.api.seckill.SeckillFacade -  */
class SeckillFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.seckill.SeckillFacade';
  }

  /**
   *  根据商品查询可以参加的活动信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/569605
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.activityAlias - 活动alias
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getActivity(kdtId, query) {
    return this.invoke('getActivity', [kdtId, query]);
  }
}

module.exports = SeckillFacade;
