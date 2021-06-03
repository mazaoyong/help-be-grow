const BaseService = require('../../../base/BaseService');

class CommonActivityPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.CommonActivityPCFacade';
  }

  /**
   * @description 获取活动基本信息
   * @link http://zanapi.qima-inc.com/site/service/view/952008
   */

  async getSimpleActivity(kdtId, query) {
    return this.invoke('getSimpleActivity', [kdtId, query]);
  }

  /**
   * @description 校验是否存在活动
   * @link http://zanapi.qima-inc.com/site/service/view/951991
   */

  async checkExistActivity(kdtId, command) {
    return this.invoke('checkExistActivity', [kdtId, command]);
  }

  /**
   * 查询活动奖励信息
   * zanAPi 地址 http://zanapi.qima-inc.com/site/service/view/981803
   * @param {number} kdtId - 店铺id
   * @param {object} query - 查询参数
   * @param {number} query.activityId - 活动id
   * @param {string} query.activityType - 活动类型
   * @param {number} query.rewardType - 奖励类型
   * @param {number} query.userId - 参与人id
   * @param {Object} pageRequest -
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {[object Object]} pageRequest.sort.orders -
   */

  async getRewardByPage(kdtId, pageRequest, query) {
    return this.invoke('getRewardByPage', [kdtId, pageRequest, query]);
  }

  async getRewardCopywriting(kdtId, query) {
    return this.invoke('getRewardCopywriting', [kdtId, query]);
  }
}

module.exports = CommonActivityPCFacade;
