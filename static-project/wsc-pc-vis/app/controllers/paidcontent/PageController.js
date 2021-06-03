const BaseController = require('../base/BaseController');

class PageController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('paidcontent/index.html');
  }
}

module.exports = PageController;
