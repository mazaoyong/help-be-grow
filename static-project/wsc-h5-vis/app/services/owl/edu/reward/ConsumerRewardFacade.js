const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.reward.RewardRecordFacade -  */
class ConsumerRewardFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.reward.RewardRecordFacadeV2';
  }

  /**
   *  查询消费者中奖记录列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394411
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} customRewardRecordQuery - 消费者中奖记录查询条件
   *  @param {boolean} customRewardRecordQuery.showInvalidReward - 展示失效奖励(可能会调整)
   *  @param {number} customRewardRecordQuery.courseProductId - 课程商品id(可选,无则查询该中奖角色的所有课程中奖记录)
   *  @param {number} customRewardRecordQuery.userId - 中奖用户id
   *  @return {Promise}
   */
  async listCustomRewardRecord(kdtId, pageRequest, customRewardRecordQuery) {
    return this.invoke('listCustomRewardRecord', [
      kdtId,
      pageRequest,
      customRewardRecordQuery,
    ]);
  }

  /**
   *  兑换奖励
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394412
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} rewardRedeemCommand - 奖励兑换命令
   *  @param {number} rewardRedeemCommand.presentedStudentId - 赠送给学员的id(可选参数)
   *  @param {number} rewardRedeemCommand.rewardRecordId - 中奖记录id
   *  @param {number} rewardRedeemCommand.userId - 中奖用户id
   *  @return {Promise}
   */
  async redeemReward(kdtId, rewardRedeemCommand) {
    return this.invoke('redeemReward', [kdtId, rewardRedeemCommand]);
  }

  /**
   *  查询奖励提示信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394410
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} rewardTipQuery - 奖励提示信息查询条件
   *  @return {Promise}
   */
  async getRewardTip(kdtId, rewardTipQuery) {
    return this.invoke('getRewardTip', [kdtId, rewardTipQuery]);
  }

  /**
   * 查询奖励弹窗信息
   *
   * @param kdtId             店铺id
   * @param rewardWindowQuery 奖励弹窗信息查询条件
   * @return 奖励提示信息
   */
  async getRewardWindow(kdtId, rewardWindowQuery) {
    return this.invoke('getRewardWindow', [kdtId, rewardWindowQuery]);
  }

  /**
   *  获取课程商品下的奖励活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394413
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} courseProductRewardActivityQuery - 课程商品奖励活动查询条件
   *  @param {string} courseProductRewardActivityQuery.courseProductAlias - 课程商品id
   *  @return {Promise}
   */
  async findCourseProductRewardActivity(
    kdtId,
    courseProductRewardActivityQuery
  ) {
    return this.invoke('findCourseProductRewardActivity', [
      kdtId,
      courseProductRewardActivityQuery,
    ]);
  }
}

module.exports = ConsumerRewardFacade;
