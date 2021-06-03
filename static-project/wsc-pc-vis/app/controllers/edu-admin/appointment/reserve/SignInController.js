const BaseController = require('../../../base/BaseController');
const SignInService = require('../../../../services/owl/pc/signin/SignInService');

class SignInController extends BaseController {
  // 批量签到
  async businessBatchSignIn(ctx) {
    const kdtId = ctx.kdtId;
    const { body = {} } = ctx.request || {};
    body.operator = this.formatOperator;
    const res = await new SignInService(ctx).businessBatchSignIn(kdtId, body);

    return ctx.json(0, 'ok', res);
  }

  // 查询课程列表
  async studentLessonsSignIn(ctx) {
    const kdtId = ctx.kdtId;
    const { body = {} } = ctx.request || {};
    body.operator = this.formatOperator;
    const res = await new SignInService(ctx).studentLessonsSignIn(kdtId, body);

    return ctx.json(0, 'ok', res);
  }

  // 获取单个签到/请假/未到提示
  async getSignInTip(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();
    const res = await new SignInService(ctx).getSignInTip(kdtId, query);

    return ctx.json(0, 'ok', res);
  }

  // 获取批量签到/请假/未到提示
  async getBatchSignInTip(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();
    const res = await new SignInService(ctx).getBatchSignInTip(kdtId, query);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = SignInController;
