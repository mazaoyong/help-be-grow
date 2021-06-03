const BaseService = require('../../../base/BaseService');

class CourseEvaluationService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.courseevaluation.CourseEvaluationFacade';
  }

  /**
   *  查询评价权限（评论权限 1:未评价，不可评价  2:未评价，可评价 3:已评价，不可追评 4:已评价，可追评 5:已评价，已追评）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/346164
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 入参
   *  @param {string} query.assetNo - 资产编号
   *  @param {integer} query.userId - 用户id
   *  @return {Promise}
   */
  async getEvaluationPermission(kdtId, query) {
    return this.owlInvoke('getEvaluationPermission', [kdtId, query]);
  }

  /**
   *  评价
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344674
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 入参
   *  @param {string} command.evaluation - 评价
   *  @param {number} command.score - 评分（1~5）
   *  @param {number} command.userType - 用户类型
   *  @param {string} command.assetNo - 资产编号
   *  @param {number} command.userId - 用户ID
   *  @param {Array.<Array>} command.pictures[] - 图片列表
   *  @return {Promise}
   */
  async createEvaluation(kdtId, command) {
    return this.owlInvoke('createEvaluation', [kdtId, command]);
  }

  /**
   *  追评
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344675
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 入参
   *  @param {string} command.evaluation - 评价
   *  @param {number} command.userType - 用户类型
   *  @param {string} command.assetNo - 资产编号
   *  @param {string} command.evaluationAlias - 评价别名
   *  @param {number} command.userId - 用户ID
   *  @param {Array.<Array>} command.pictures[] - 图片列表
   *  @return {Promise}
   */
  async createEvaluationAddition(kdtId, command) {
    return this.owlInvoke('createEvaluationAddition', [kdtId, command]);
  }

  /**
   *  查看评价详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344676
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 入参
   *  @param {string} query.courseAlias - 线下课别名
   *  @param {number} query.userType - 用户类型
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async getByCondition(kdtId, query) {
    return this.owlInvoke('getByCondition', [kdtId, query]);
  }

  /**
   *  统计评价数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344677
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} courseAlias - 线下课别名
   *  @return {Promise}
   */
  async getEvaluationCountByCourseAlias(kdtId, courseAlias) {
    return this.owlInvoke('getEvaluationCountByCourseAlias', [kdtId, courseAlias]);
  }

  /**
   *  获取最新一条评价（非屏蔽的评价）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344678
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 入参
   *  @param {string} query.courseAlias - 线下课别名
   *  @param {number} query.userType - 用户类型
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async getLastEvaluationByCondition(kdtId, query) {
    return this.owlInvoke('getLastEvaluationByCondition', [kdtId, query]);
  }

  /**
   *  查询C端评价列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347225
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 入参
   *  @param {string} query.courseAlias - 线下课别名
   *  @param {string} query.tag - 标签 1:全部 5：有图 2：好评 3：中评 4：差评 6：追评
   *  @param {number} query.userType - 用户类型
   *  @param {number} query.userId - 用户ID
   *  @param {Object} pageRequest - 入参
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findByUserInfo(kdtId, query, pageRequest) {
    return this.owlInvoke('findByUserInfo', [kdtId, query, pageRequest]);
  }

  /**
   *  点赞
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344680
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 入参
   *  @param {number} command.userType - 用户类型
   *  @param {string} command.evaluationAlias - 评价别名
   *  @param {number} command.userId - 用户ID
   *  @return {Promise}
   */
  async like(kdtId, command) {
    return this.owlInvoke('like', [kdtId, command]);
  }

  /**
   *  取消点赞
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/344681
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 入参
   *  @param {number} command.userType - 用户类型
   *  @param {string} command.evaluationAlias - 评价别名
   *  @param {number} command.userId - 用户ID
   *  @return {Promise}
   */
  async cancelLike(kdtId, command) {
    return this.owlInvoke('cancelLike', [kdtId, command]);
  }
}

module.exports = CourseEvaluationService;
