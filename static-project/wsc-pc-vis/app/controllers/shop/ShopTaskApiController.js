const BaseController = require('../base/BaseController');
const ShopTaskApiService = require('../../services/common/ShopTaskApiService');

class ShopTaskApiController extends BaseController {
  // 任务完成接口
  async finishTask(ctx) {
    const { code } = ctx.request.body || {};
    const data = await new ShopTaskApiService(ctx).finishTask(ctx.kdtId, code);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = ShopTaskApiController;
