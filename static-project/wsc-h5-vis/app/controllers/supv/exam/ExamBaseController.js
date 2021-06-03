const BaseController = require('../../base/BaseController');

class ExamBaseController extends BaseController {
  async init() {
    await super.init();

    // 只有页面请求才打日志
    if (!this.ctx.acceptJSON) {
      this.ctx.localLog('log', this.ctx.prettyjson({
        name: 'ExamBaseController',
        args: this.ctx.originalUrl,
        res: this.ctx.getGlobal(),
      }));
      this.ctx.visLogger.info('[ExamBaseController] path result global', '', this.ctx.getGlobal());
    }
  }
}

module.exports = ExamBaseController;
