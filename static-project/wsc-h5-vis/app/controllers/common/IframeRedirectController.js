const { Controller } = require('astroboy');

class IframeRedirectController extends Controller {
  async getIndexHtml(ctx) {
    this.ctx.setGlobal('kdt_id', ctx.kdtId);
    await ctx.render('common/redirect/iframe.html');
  }
}

module.exports = IframeRedirectController;
