const BaseController = require('../base/BaseController');
const URL = require('@youzan/wsc-pc-base/app/lib/URL');

class SignInController extends BaseController {
  init() {
    super.init();
  }

  redirectSigninList() {
    this.ctx.redirect(URL.site('/vis/edu/page/new-signin#/list', 'v4'));
  }

  redirectSigninEdit() {
    this.ctx.redirect(URL.site('/vis/edu/page/new-signin#/edit', 'v4'));
  }
}

module.exports = SignInController;
