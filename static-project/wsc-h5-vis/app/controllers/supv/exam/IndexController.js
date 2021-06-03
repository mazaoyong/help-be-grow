const ExamBaseController = require('./ExamBaseController');

class IndexController extends ExamBaseController {
  async init() {
    await super.init();
  }

  // 有特殊标志 使用微信强制登录
  async pageAcl() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
      kdtId: this.ctx.kdtId,
    });
  }

  async getIndexHtml(ctx) {
    await this.pageAcl();
    await ctx.render('supv/exam/index.html');
  }
}

module.exports = IndexController;
