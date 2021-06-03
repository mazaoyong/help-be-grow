import { Context } from 'astroboy';
const BaseController = require('../base/BaseNewController');
const SmsCaptchaFacade = require('../../services/api/owl/api/SmsCaptchaFacade');

class SmsCaptchaController extends BaseController {
  async sendSmsCaptcha(ctx: Context) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const result = await new SmsCaptchaFacade(ctx).sendSmsCaptcha(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  async verifySmsCaptcha(ctx: Context) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const result = await new SmsCaptchaFacade(ctx).verifySmsCaptcha(kdtId, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = SmsCaptchaController;
