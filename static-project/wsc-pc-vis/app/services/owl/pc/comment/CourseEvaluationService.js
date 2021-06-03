const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.comment.CourseEvaluationFacade -  */class CourseEvaluationFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.comment.CourseEvaluationFacade';
  }

  /**
   *  查询PC端评价列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421572
   *
   *  @param {number} kdtId - 操作店铺ID
   *  @param {Object} query - 入参
   *  @param {number} query.score - 评分等级 1~5 0:全部
   *  @param {string} query.courseName - 线下课名称
   *  @param {string} query.orderNo - 订单编号
   *  @param {Array.<Array>} query.evaluationRange[] - 时间区间（精确到时分秒）
   *  @param {Array.<Array>} query.kdtIdList[] - 查询分店列表
   *  @param {string} query.eduCourseName - 课程名称
   *  @param {Object} pageRequest - 入参
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findByCondition(kdtId, query, pageRequest) {
    return this.invoke('findByCondition', [kdtId, query, pageRequest]);
  }

  /**
   *  商家回复
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421571
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 入参
   *  @param {string} command.evaluation - 评价
   *  @param {string} command.evaluationAlias - 评价别名
   *  @param {number} command.userId - 用户ID
   *  @param {Array.<Array>} command.pictures[] - 图片列表
   *  @param {Array} command.pictures[] -
   *  @return {Promise}
   */
  async createEvaluationReply(kdtId, command) {
    return this.invoke('createEvaluationReply', [kdtId, command]);
  }
}

module.exports = CourseEvaluationFacade;
