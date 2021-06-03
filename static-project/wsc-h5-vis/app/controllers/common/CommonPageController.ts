import { Context } from 'astroboy';
import BaseController from '../base/BaseNewController';

class CommonPageController extends BaseController {
  async getFeedbackHTML(ctx: Context) {
    await this.baseAcl({ useAjaxLogin: false });
    await ctx.render('common/feedback');
  }
}

module.exports = CommonPageController;
