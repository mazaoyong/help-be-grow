const ReviewBaseService = require('./ReviewBaseService');

/**
 * 售后评价相关
 */
class ItemEvaluationWriteService extends ReviewBaseService {
  /**
   * ItemEvaluationReadService
   */
  get SERVICE_NAME() {
    return 'com.youzan.review.service.ItemEvaluationWriteService';
  }

  /**
   *  查询订单发票列表
   *  @param {object} param
   */
  async createEvaluation(param) {
    return this.invoke('createEvaluation', [param]);
  }

  /**
   *  取消置顶
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511861
   *
   *  @param {Object} evaluationWeightUpdateParam -
   *  @param {number} evaluationWeightUpdateParam.evaluationId - 评价id
   *  @param {number} evaluationWeightUpdateParam.itemId -
   *  @param {number} evaluationWeightUpdateParam.kdtId - 店铺kdtId
   *  @param {string} evaluationWeightUpdateParam.fromApp - 请求来源
   *  @param {string} evaluationWeightUpdateParam.requestId - UUID
   *  @param {string} evaluationWeightUpdateParam.operator - 操作人信息,
   *  json 格式 ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise}
   */
  async unStickItemEvaluation(evaluationWeightUpdateParam) {
    return this.invoke('unStickItemEvaluation', [evaluationWeightUpdateParam]);
  }

  /**
   *  置顶
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511860
   *
   *  @param {Object} evaluationWeightUpdateParam -
   *  @param {number} evaluationWeightUpdateParam.evaluationId - 评价id
   *  @param {number} evaluationWeightUpdateParam.itemId -
   *  @param {number} evaluationWeightUpdateParam.kdtId - 店铺kdtId
   *  @param {string} evaluationWeightUpdateParam.fromApp - 请求来源
   *  @param {string} evaluationWeightUpdateParam.requestId - UUID
   *  @param {string} evaluationWeightUpdateParam.operator - 操作人信息,
   *  json 格式 ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise}
   */
  async stickItemEvaluation(evaluationWeightUpdateParam) {
    return this.invoke('stickItemEvaluation', [evaluationWeightUpdateParam]);
  }

  /**
   *  评价加精
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/626596
   *
   *  @param {Object} param -
   *  @param {number} param.evaluationId - 评价ID
   *  @param {number} param.kdtId - 店铺ID
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {string} param.operator - 操作人信息,
   *  json 格式 ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise}
   */
  async addExcellentEvaluation(param) {
    return this.invoke('addExcellentEvaluation', [param]);
  }

  /**
   *  取消评价加精
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/626597
   *
   *  @param {Object} param -
   *  @param {number} param.evaluationId - 评价ID
   *  @param {number} param.kdtId - 店铺ID
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {string} param.operator - 操作人信息
   *  json 格式 ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise}
   */
  async cancelExcellentEvaluation(param) {
    return this.invoke('cancelExcellentEvaluation', [param]);
  }
}

module.exports = ItemEvaluationWriteService;
