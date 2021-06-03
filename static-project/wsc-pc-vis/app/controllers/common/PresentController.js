const BaseController = require('../base/BaseController');
const BuyGivePresentFacade = require('../../services/owl/pc/buygive/BuyGivePresentFacade');

class PresentController extends BaseController {
  // 获取赠品列表
  async findPresentGoods(ctx) {
    const kdtId = ctx.kdtId;
    const { command, pageRequest } = ctx.getQueryParse() || {};
    const res = await new BuyGivePresentFacade(ctx).findPresentGoods(kdtId, command, pageRequest);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = PresentController;
