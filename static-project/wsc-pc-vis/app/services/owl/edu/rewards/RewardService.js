const BaseService = require('../../../base/BaseService');

// 奖励页面
class RewardsService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.reward.RewardFacadeV2';
  }
  /**
     *  创建奖励活动
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394405
     *
     *  @param {number} kdtId - 店铺id
     *  @param {Object} rewardActivityCreateCommand - 奖励活动创建命令
     *  @param {Object} rewardActivityCreateCommand.rewardConditionDTO - 中奖条件
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.rewardNodeType - 发放节点类型
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.conditionValue - 发放条件数值
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.conditionType - 发放条件类型
     *  @param {number} rewardActivityCreateCommand.showStatus - 奖励C端展示状态(0 不展示,1 展示)
     *  @param {Array.<Object>} rewardActivityCreateCommand.awardDTOList[] - 奖品信息
     *  @param {string} rewardActivityCreateCommand.productAlias - 课程商品别名
     *  @return {Promise}
     */
  async createRewardActivity(kdtId, rewardActivityCreateCommand) {
    return this.invoke('createRewardActivity', [
      kdtId,
      rewardActivityCreateCommand,
    ]);
  }

   /**
     *  更新奖励活动
     *
     *  @param {number} kdtId - 店铺id
     *  @param {Object} rewardActivityCreateCommand - 奖励活动创建命令
     *  @param {Object} rewardActivityCreateCommand.rewardConditionDTO - 中奖条件
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.rewardNodeType - 发放节点类型
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.conditionValue - 发放条件数值
     *  @param {integer} rewardActivityCreateCommand.rewardConditionDTO.conditionType - 发放条件类型
     *  @param {number} rewardActivityCreateCommand.showStatus - 奖励C端展示状态(0 不展示,1 展示)
     *  @param {Array.<Object>} rewardActivityCreateCommand.awardDTOList[] - 奖品信息
     *  @param {string} rewardActivityCreateCommand.productAlias - 课程商品别名
     *  @return {Promise}
     */
    async updateRewardActivity(kdtId, rewardActivityCreateCommand) {
      return this.invoke('updateRewardActivity', [
        kdtId,
        rewardActivityCreateCommand,
      ]);
    }

  /**
     *  查询奖励活动列表
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394404
     *
     *  @param {number} kdtId - 店铺id
     *  @param {Object} pageRequest - 分页参数
     *  @param {number} pageRequest.pageNumber -
     *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
     *  @param {number} pageRequest.pageSize -
     *  @param {Object} pageRequest.sort -
     *  @param {Object} rewardActivityQuery - 奖励活动查询条件
     *  @param {number} rewardActivityQuery.rewardNodeType - 发放节点类型
     *  @param {string} rewardActivityQuery.courseProductName - 课程商品名称
     *  @param {number} rewardActivityQuery.awardType - 奖品类型
     *  @param {number} rewardActivityQuery.status - 奖励活动状态
     *  @return {Promise}
     */
  async listRewardActivity(kdtId, pageRequest, rewardActivityQuery) {
    return this.invoke('listRewardActivity', [
      kdtId,
      pageRequest,
      rewardActivityQuery,
    ]);
  }

  /**
     *  查询中奖记录列表
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394409
     *
     *  @param {number} kdtId - 店铺id
     *  @param {Object} pageRequest - 分页参数
     *  @param {number} pageRequest.pageNumber -
     *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
     *  @param {number} pageRequest.pageSize -
     *  @param {Object} pageRequest.sort -
     *  @param {Object} rewardRecordQuery - 中奖记录查询条件
     *  @param {string} rewardRecordQuery.orderNo - 订单编号
     *  @param {string} rewardRecordQuery.courseProductName - 课程商品名称
     *  @param {string} rewardRecordQuery.studentName - 学员姓名
     *  @param {number} rewardRecordQuery.awardType - 奖品类型(null:全部,1:优惠券,4:积分)
     *  @return {Promise}
     */
  async listRewardRecord(kdtId, pageRequest, rewardRecordQuery) {
    return this.invoke('listRewardRecord', [
      kdtId,
      pageRequest,
      rewardRecordQuery,
    ]);
  }

  /**
     *  更新奖励活动状态
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394407
     *
     *  @param {number} kdtId - 店铺id
     *  @param {Object} rewardActivityStatusUpdateCommand - 奖励活动状态更新命令
     *  @param {number} rewardActivityStatusUpdateCommand.activityStatus - 奖励活动状态
     *  @param {number} rewardActivityStatusUpdateCommand.rewardActivityId - 奖励活动id
     *  @return {Promise}
     */
  async updateRewardActivityStatus(kdtId, rewardActivityStatusUpdateCommand) {
    return this.invoke('updateRewardActivityStatus', [
      kdtId,
      rewardActivityStatusUpdateCommand,
    ]);
  }

  /**
   *  查询课程商品关联的奖励配置信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/394408
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} rewardRelationInfoQuery - 关联奖励配置信息查询条件
   *  @param {string} rewardRelationInfoQuery.productAlias - 课程商品别名
   *  @return {Promise}
   */
  async getCourseProductRewardRelationInfo(kdtId, rewardRelationInfoQuery) {
    return this.invoke('getCourseProductRewardRelationInfo', [
      kdtId,
      rewardRelationInfoQuery,
    ]);
  }

  /**
   *  提交导出奖励导出任务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1079462
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} exportQuery - 单个奖励活动获取命令
   *  @param {number} exportQuery.rewardNodeType - 奖励节点类型
   *  @param {string} exportQuery.orderNo - 订单编号
   *  @param {string} exportQuery.courseProductName - 课程商品名称
   *  @param {string} exportQuery.phone - 学员电话
   *  @param {number} exportQuery.campusKdtId - 指定校区店铺id
   *  @param {string} exportQuery.redeemEnd - 领取时间（下限）
   *  @param {string} exportQuery.redeemStart - 领取时间（上限）
   *  @param {string} exportQuery.createEnd - 创建时间（下限）
   *  @param {string} exportQuery.studentName - 学员姓名
   *  @param {string} exportQuery.createStart - 创建时间（上限）
   *  @param {Object} exportQuery.operator - 操作人
   *  @param {number} exportQuery.awardType - 奖品类型
   *  @return {Promise}
   */
  async submitExportRewardRecordTask(operatorKdtId, exportQuery) {
    return this.invoke('submitExportRewardRecordTask', [
      operatorKdtId,
      exportQuery
    ]);
  }

  /**
   *  查询单个奖励活动信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/491322
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} rewardActivityGetCommand - 单个奖励活动获取命令
   *  @param {number} rewardActivityGetCommand.rewardActivityId - 奖励活动id
   *  @return {Promise}
   */
  async getRewardActivity(operatorKdtId, rewardActivityGetCommand) {
    return this.invoke('getRewardActivity', [operatorKdtId, rewardActivityGetCommand]);
  }
}

module.exports = RewardsService;
