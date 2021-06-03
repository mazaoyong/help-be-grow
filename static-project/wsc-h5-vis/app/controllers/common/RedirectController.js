const BaseController = require('../../controllers/base/BaseNewController');

class RedirectController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('common/redirect/weapp.html');
  }
}

module.exports = RedirectController;
