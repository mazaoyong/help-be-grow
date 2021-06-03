const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.exercisebook.ExerciseRewardFacade */
class ExerciseRewardFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.ExerciseRewardFacade';
  }

  /**
   *  查询作业的奖励配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1077406
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 连锁总部视角下的校区店铺id
   *  @return {Promise}
   */
  async getExerciseReward(kdtId, query) {
    return this.invoke('getExerciseReward', [kdtId, query]);
  }

  /**
   *  保存奖励配置信息
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1079205
    *
    *  @param {number} kdtId -
    *  @param {Object} command -
    *  @param {Array.<Object>} command.awardData[] - 奖品数据
    *  @param {integer} command.awardData[].awardNode - 奖励节点
      1：提交作业
      2：分享作业
      3：作业评优
    *  @param {[object Object]} command.awardData[].awardList - 奖品信息
    *  @return {Promise}
    */
  async saveExerciseReward(kdtId, command) {
    return this.invoke('saveExerciseReward', [kdtId, command]);
  }
}

module.exports = ExerciseRewardFacade;
