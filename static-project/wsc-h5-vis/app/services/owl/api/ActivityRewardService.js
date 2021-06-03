const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.reward.ActivityRewardFacade -  */
class ActivityRewardFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.reward.ActivityRewardFacade';
  }

  /**
   *  奖励知识付费商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/704952
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.alias - 商品alias
   *  @param {Object} command.userWrap - 用户信息
   *  @param {Object} command.activityInfo - 活动信息
   *  @param {Object} command.infoCollect - 需要采集的信息
   *  @return {Promise}
   */
  async reward(kdtId, command) {
    return this.invoke('reward', [kdtId, command]);
  }
}

module.exports = ActivityRewardFacade;
