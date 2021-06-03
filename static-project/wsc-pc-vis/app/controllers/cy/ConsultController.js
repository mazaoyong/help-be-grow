const BaseController = require('../base/BaseController');
const FoodPluginApplyService = require('../../services/cy/FoodPluginApplyService');
const BehaviorCaptchaService = require('../../services/uic/captcha/BehaviorCaptchaService');

class ConsultController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('cy/consult.html');
  }

  async postConsultJson(ctx) {
    const data = ctx.request.body;
    const result = await new FoodPluginApplyService(ctx).apply(data);
    return ctx.json(0, 'ok', result);
  }

  /**
   * 咨询接口加入行为组件校验，防止批量虚假数据
   */
  async sendBehaviorCaptchaJson(ctx) {
    const { ticket } = ctx.getQueryParse() || {};
    this.validator.required(ticket, '参数错误，token不能为空');
    let validResult = false;
    try {
      validResult = await new BehaviorCaptchaService(ctx).secondCheckBehaviorToken({
        token: ticket,
      });
    } catch (e) {
      // 二次校验服务只会返回 true/false，如果能进来这里，说明服务出问题了，为了不阻塞主流程，可以暂时放行
      validResult = true;
    }
    if (validResult) {
      ctx.json(0, 'ok', true);
    } else {
      ctx.json(10000001, 'token 校验未通过');
    }
  }
}

module.exports = ConsultController;
