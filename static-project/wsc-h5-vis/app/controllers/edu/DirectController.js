const BaseController = require('../../controllers/base/BaseNewController');

class DirectController extends BaseController {
  async getAttentionsInPurchaseIndex(ctx) {
    await ctx.render('edu/attentions-in-purchase.html');
  }
}

module.exports = DirectController;
