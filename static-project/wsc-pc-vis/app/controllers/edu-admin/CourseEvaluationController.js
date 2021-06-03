const BaseController = require('../base/BaseController');
const CourseEvaluationService = require('../../services/owl/pc/comment/CourseEvaluationService');

class CourseEvaluationController extends BaseController {
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    // 根据 kdtId 获取公众号详情
    // const mpAccount = await new MpAccountService(ctx).getMpAccount(ctx.kdtId);

    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('edu-admin/evaluation/index.html');
  }

  // 获取课程评价列表
  async getEvaluationListJson(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new CourseEvaluationService(ctx).findByCondition(
      kdtId,
      query,
      pageRequest,
    );

    return ctx.json(0, 'ok', data);
  }

  // 提交卖家评价
  async putSellerEvaluation(ctx) {
    const { kdtId } = ctx;
    const { body = {} } = ctx.request;

    const data = await new CourseEvaluationService(ctx).createEvaluationReply(kdtId, body);

    return ctx.json(0, 'ok', data);
  }
}

module.exports = CourseEvaluationController;
