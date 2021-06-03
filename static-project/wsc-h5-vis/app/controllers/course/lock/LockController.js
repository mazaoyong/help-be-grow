const BaseController = require('../../base/BaseController');

class LockController extends BaseController {
  async getLockIndex(ctx) {
    await ctx.render('course/lock/index.html');
  }
}

module.exports = LockController;
