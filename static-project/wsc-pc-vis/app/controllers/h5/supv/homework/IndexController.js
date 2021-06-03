const BaseController = require('../../base/BaseController');

class IndexController extends BaseController {
  async renderHtml(ctx) {
    await this.checkHomeworkWhiteList(ctx);
    await ctx.render('h5/supv/homework/index.html');
  }

  async checkHomeworkWhiteList(ctx) {
    const prevWhiteList = this.ctx.getState('whitelist', {});
    const homeworkEnabled = await this.checkInWhiteList(ctx, 'edu_homework');

    const newWhiteList = { ...prevWhiteList, homework: homeworkEnabled };
    this.ctx.setState('whitelist', newWhiteList);
    this.ctx.setGlobal('whitelist', newWhiteList);
  }
}

module.exports = IndexController;
