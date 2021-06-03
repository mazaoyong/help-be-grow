const BaseController = require('../../base/BaseNewController');

class orderBaseController extends BaseController {
  async init() {
    if (!this.ctx.acceptJSON) {
      await super.init();
    }
  }
}

module.exports = orderBaseController;
