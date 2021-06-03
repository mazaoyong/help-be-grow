const BaseController = require('../../controllers/base/BaseNewController');
const WeappAccountService = require('../../services/channels/WeappAccountService');

class WeappController extends BaseController {
  // 获取小程序版本信息
  async getWeappInfo(ctx) {
    const { kdtId = 0 } = ctx;
    const weappAccountService = new WeappAccountService(ctx);
    // 小程序版本信息，暂时用不到
    // const weappVersion = await weappAccountService.getWeappCodeLcByKdtId(kdtId);
    // 获取小程序店铺信息
    const weappAccount = await weappAccountService.getWeappAccountByKdtId(kdtId);
    ctx.json(0, 'ok', weappAccount);
  }
}

module.exports = WeappController;
