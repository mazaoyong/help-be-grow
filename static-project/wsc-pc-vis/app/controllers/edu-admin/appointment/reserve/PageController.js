const BaseController = require('../../../base/BaseController');
const URL = require('@youzan/wsc-pc-base/app/lib/URL');

class PageController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('edu-admin/appointment/index.html');
  }

  async getOldIndexHtml(ctx) {
    await ctx.redirect(URL.site('/vis/edu/page/appointment', 'v4'));
  }
}

module.exports = PageController;
