import { Context } from 'astroboy';
import BaseController from '../../base/BaseNewController';

class IndexController extends BaseController {
  async renderIndex(ctx: Context) {
    let path = ctx.path;
    if (path && (
      path.includes('list') ||
      path.includes('result') ||
      path.includes('answer/review') ||
      path.includes('answer/answer')
    )) {
      await this.baseAcl({
        forceOauthLogin: true,
        weixinOauthScope: 'snsapi_userinfo',
      });
    } else {
      await this.baseAcl({
        useAjaxLogin: true,
      });
    }
    await this.setGlobalTheme();
    await ctx.render('supv/examination/index');
  }
}

export = IndexController;
