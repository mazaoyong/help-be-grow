const BaseController = require('../base/BaseController');
const AppSubscribeQueryService = require('../../services/common/AppSubscribeQueryService');
class AppSubscribeInfoController extends BaseController {
  async fetchAppSubscribeInfo(ctx) {
    const { appId } = ctx.query;
    const operator = this.formatOperator;
    const params = {
      appId,
      kdtId: ctx.kdtId,
      userId: operator.userId,
    };
    const data = await new AppSubscribeQueryService(ctx).getAppSubscribeInfo(params);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = AppSubscribeInfoController;
