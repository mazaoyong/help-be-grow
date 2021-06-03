const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.ump.api.core.ActivityRewardSnapshotFacade -  */
class ActivityRewardSnapshotFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.core.ActivityRewardSnapshotFacade';
  }

  /**
   *  查询奖励状态。 0:奖励未发放; 1:奖励已发放;
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/319687
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 活动实例query
   *  @param {number} query.fansId - 粉丝类型
   *  @param {string} query.channel - 活动渠道
   *  @param {number} query.bizId - 业务id
   *  @param {number} query.userId - 用户id
   *  @param {number} query.fansType - 粉丝类型
   *  @return {Promise}
   */
  async getStatus(kdtId, query) {
    return this.invoke('getStatus', [kdtId, query]);
  }
}

module.exports = ActivityRewardSnapshotFacade;
