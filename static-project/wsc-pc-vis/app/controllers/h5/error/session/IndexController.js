/* eslint-disable jsdoc/require-param */
const BaseController = require('../../../base/BaseController');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('error/session/index.html');
  }
}

module.exports = IndexController;
