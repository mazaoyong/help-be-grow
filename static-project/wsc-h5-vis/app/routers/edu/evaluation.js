/**
 * 评价相关接口
 */
module.exports = [
  /**
   * 评价列表页
   */
  ['GET', '/wscvis/edu/evaluation-list', 'edu.RenderController', 'renderEvalutionListHtml'],

  /**
   * 评价详情页
   */
  ['GET', '/wscvis/edu/evaluation-detail', 'edu.RenderController', 'renderEvalutionDetailHtml'],

  /**
   * 创建评价页面
   */
  ['GET', '/wscvis/edu/evaluation-create', 'edu.RenderController', 'renderEvalutionCreateHtml'],

  /**
   * 评价权限
   */
  ['GET', '/wscvis/edu/evaluation/getEvaluationPermission.json', 'edu.EvaluationController', 'getEvaluationPermissionJson'],

  /**
   * 创建评价
   */
  ['POST', '/wscvis/edu/evaluation/createEvaluation.json', 'edu.EvaluationController', 'postCreateEvaluationJson'],

  /**
   * 追评
   */
  ['POST', '/wscvis/edu/evaluation/createEvaluationAddition.json', 'edu.EvaluationController', 'postCreateEvaluationAddition'],

  /**
   * 获取评价详情
   */
  ['GET', '/wscvis/edu/evaluation/detail.json', 'edu.EvaluationController', 'getByConditionJson'],

  /**
   * 获取统计评价数
   */
  ['GET', '/wscvis/edu/evaluation/evaluationCount.json', 'edu.EvaluationController', 'getEvaluationCountByCourseAliasJson'],

  /**
   * 获取最新一条评价
   */
  ['GET', '/wscvis/edu/evaluation/lastEvaluation.json', 'edu.EvaluationController', 'getLastEvaluationByConditionJson'],

  /**
   * 获取评价列表
   */
  ['GET', '/wscvis/edu/evaluation/list.json', 'edu.EvaluationController', 'getFindByUserInfoJson'],

  /**
   * 点赞
   */
  ['POST', '/wscvis/edu/evaluation/like.json', 'edu.EvaluationController', 'postLikeJson'],

  /**
   * 取消点赞
   */
  ['POST', '/wscvis/edu/evaluation/cancelLike.json', 'edu.EvaluationController', 'postCancelLikeJson'],
];
