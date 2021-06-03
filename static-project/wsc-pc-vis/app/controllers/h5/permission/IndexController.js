/**
 * 权限
 */
const BaseController = require('../base/BaseController');

class IndexController extends BaseController {
  async getPermission(ctx) { // 获取权限
    const res = await this.initPermission();

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
