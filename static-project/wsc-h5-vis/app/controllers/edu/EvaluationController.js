const BaseController = require('../base/BaseNewController');
const CourseEvaluationService = require('../../services/owl/edu/courseevaluation/CourseEvaluationService');

class EvaluationController extends BaseController {
  // 获取用户id
  get userId() {
    return this.ctx.buyerId || 0;
  }

  // 获取用户type
  get userType() {
    return this.buyer.fansType || 0;
  }

  // 获取评价权限
  async getEvaluationPermissionJson(ctx) {
    const {
      assetNo = 0,
      kdtId = 0,
    } = ctx.query;
    const result = await new CourseEvaluationService(ctx).getEvaluationPermission(
      kdtId, {
        assetNo,
        userId: this.userId,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 创建评价
  async postCreateEvaluationJson(ctx) {
    const {
      evaluation = '',
      score = 1,
      assetNo = 0,
      pictures = [],
      kdtId = 0,
    } = ctx.request.body;
    const result = await new CourseEvaluationService(ctx).createEvaluation(
      kdtId, {
        evaluation,
        score,
        assetNo,
        pictures,
        userId: this.userId,
        userType: this.userType,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 追评
  async postCreateEvaluationAddition(ctx) {
    const {
      evaluation = '',
      evaluationAlias = '',
      assetNo = 0,
      pictures = [],
      kdtId = this.kdtId,
    } = ctx.request.body;
    const result = await new CourseEvaluationService(ctx).createEvaluationAddition(
      kdtId, {
        evaluation,
        evaluationAlias,
        assetNo,
        pictures,
        userId: this.userId,
        userType: this.userType,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取评价详情
  async getByConditionJson(ctx) {
    const {
      kdtId = 0,
      assetNo = '',
    } = ctx.query;
    this.validator.required(assetNo, '缺少必要参数 - assetNo');
    let evaluationService = new CourseEvaluationService(ctx);
    let [evaluationStatus, evaluationDetail] = await Promise.all([
      evaluationService.getEvaluationPermission(
        kdtId, { assetNo }
      ),
      evaluationService.getByCondition(
        kdtId, { assetNo, userType: this.userType, userId: this.userId }
      ),
    ]);
    /* const result = await new CourseEvaluationService(ctx).getByCondition(
      kdtId, { courseAlias, userType: this.userType, userId: this.userId }
    ); */
    let result = {};
    if (!evaluationDetail.code && !evaluationStatus.code) {
      result = {
        evaluationStatus,
        ...evaluationDetail,
      };
    } else if (!evaluationDetail.code) {
      result = {
        evaluationStatus: -1,
        ...evaluationDetail,
      };
    } else {
      result = {
        evaluationStatus: -1,
      };
    }
    ctx.json(0, 'ok', result);
  }

  // 获取统计评价数
  async getEvaluationCountByCourseAliasJson(ctx) {
    const {
      kdtId = this.kdtId,
      courseAlias = '',
    } = ctx.query;
    const result = await new CourseEvaluationService(ctx).getEvaluationCountByCourseAlias(
      kdtId, courseAlias
    );
    ctx.json(0, 'ok', result);
  }

  // 获取最新一条评价
  async getLastEvaluationByConditionJson(ctx) {
    const {
      courseAlias = '',
    } = ctx.query;
    const kdtId = ctx.kdtId;

    this.validator.required(courseAlias, '缺少必要参数 - courseAlias');
    let evaluationService = new CourseEvaluationService(ctx);
    let [evaluationCountData, lastEvaluation] = await Promise.all([
      evaluationService.getEvaluationCountByCourseAlias(kdtId, courseAlias),
      evaluationService.getLastEvaluationByCondition(kdtId,
        {
          courseAlias,
          userId: this.userId,
          userType: this.userType,
        }),
    ]);

    // 将评价总数与最新一条评价数据进行组合
    let count = 0;
    evaluationCountData.forEach(item => {
      if (item.tagType === 'all') {
        count = item.count;
      }
    });
    const result = {
      count,
      lastEvaluation,
    };
    ctx.json(0, 'ok', result);
  }

  // 获取评价列表
  async getFindByUserInfoJson(ctx) {
    const {
      kdtId = this.kdtId,
      alias = '',
      pageNumber = 1,
      pageSize = 10,
      tagAlias = 'all',
    } = ctx.query;
    this.validator.required(tagAlias, '缺少必要参数 - tagAlias');
    const result = await new CourseEvaluationService(ctx).findByUserInfo(
      kdtId,
      {
        courseAlias: alias,
        tagAlias,
        userId: this.userId,
        userType: this.userType,
      },
      {
        pageNumber,
        pageSize,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 点赞
  async postLikeJson(ctx) {
    const {
      kdtId = this.kdtId,
      evaluationAlias = '',
    } = ctx.request.body;
    this.validator.required(evaluationAlias, '缺少必要参数 - evaluationAlias');
    const result = await new CourseEvaluationService(ctx).like(
      kdtId,
      {
        evaluationAlias,
        userId: this.userId,
        userType: this.userType,
      }
    );
    ctx.json(0, 'ok', result);
  }

  // 取消点赞
  async postCancelLikeJson(ctx) {
    const {
      kdtId = this.kdtId,
      evaluationAlias = '',
    } = ctx.request.body;
    this.validator.required(evaluationAlias, '缺少必要参数 - evaluationAlias');
    const result = await new CourseEvaluationService(ctx).cancelLike(
      kdtId,
      {
        evaluationAlias,
        userId: this.userId,
        userType: this.userType,
      }
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = EvaluationController;
