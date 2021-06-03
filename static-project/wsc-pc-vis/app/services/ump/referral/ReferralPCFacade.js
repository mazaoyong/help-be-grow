const BaseService = require('../../base/BaseService');
/* com.youzan.owl.pc.api.ump.referral.ReferralPCFacade -  */
class ReferralPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.referral.ReferralPCFacade';
  }

  /**
    *  查询推荐有奖活动列表(基于ump的包了一层, 加上教育定制逻辑)
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/917213
    *
    *  @param {Object} queryParamDTO -
    *  @param {number} queryParamDTO.kdtId - 店铺id
    *  @param {number} queryParamDTO.hqKdtId - 总店店铺id（连锁需传）
    *  @param {number} queryParamDTO.shopRole - 店铺类型，1总店，2分店（连锁需传）
    *  @param {number} queryParamDTO.pageSize - 每页数量
    *  @param {number} queryParamDTO.page - page
    *  @param {string} queryParamDTO.keyword - 活动名称
    *  @param {number} queryParamDTO.status - 查询状态
      0: 所有，1: 未开始，2: 进行中，3: 已结束，4: 未结束，5: 已失效，6:待审批，7:已驳回，8:已撤回
    *  @return {Promise}
    */
  async findActivities(queryParamDTO) {
    return this.invoke('findActivities', [queryParamDTO]);
  }

  /**
   *  查询推荐有奖活动概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/922824
   *
   *  @param {number} kdtId -
   *  @param {number} activityId -
   *  @return {Promise}
   */
  async getOverview(kdtId, activityId) {
    return this.invoke('getOverview', [kdtId, activityId]);
  }

  /**
   *  获取推荐人排行榜
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/922825
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query -
   *  @param {number} query.activityId - 活动id(必传)
   *  @return {Promise}
   */
  async findRankDataByPage(kdtId, pageRequest, query) {
    return this.invoke('findRankDataByPage', [kdtId, pageRequest, query]);
  }

  /**
   *  查询活动详细数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/922826
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.activityId - 活动id(必传)
   *  @param {string} query.orderNo -
   *  @param {number} query.designatedKdtId - 指派的店铺id，如果是0，表示查所有店铺
   *  @param {string} query.rewardTimeEnd - 奖励结束时间
   *  @param {string} query.oldCustomerKeyword - 推荐人关键字
   *  @param {string} query.rewardTimeStart - 奖励开始时间
   *  @return {Promise}
   */
  async findDetailDataByPage(kdtId, pageRequest, query) {
    return this.invoke('findDetailDataByPage', [kdtId, pageRequest, query]);
  }

  /**
   *  根据活动id查询推荐有奖详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/927412
   *
   *  @param {number} kdtId -
   *  @param {number} activityId -
   *  @return {Promise}
   */
  async getDetailByActivityId(kdtId, activityId) {
    return this.invoke('getDetailByActivityId', [kdtId, activityId]);
  }

  /**
   *  推荐有奖活动导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/927546
   *
   *  @param {number} kdtId -
   *  @param {string} query -
   *  @return {Promise}
   */
  async exportReferralRewardData(kdtId, query) {
    return this.invoke('exportReferralRewardData', [kdtId, query]);
  }

  /**
   * 查询推荐人奖励发放明细
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/998268
   *
   * @param {number} kdtId 店铺ID
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} queryDTO - undefined
   * @param {number} queryDTO.activityId - 活动ID
   * @param {number} queryDTO.userId - 推荐人ID
   * @param {number} queryDTO.rewardType - 奖励类型 1：积分 2：优惠券 3：赠品
   * @return {Promise}
   */
  async findRewardDetail(kdtId, pageRequest, queryDTO) {
    return this.invoke('findRewardDetail', [kdtId, pageRequest, queryDTO]);
  }
}

module.exports = ReferralPCFacade;
