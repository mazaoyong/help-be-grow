const PcStoreFacade = require('../../../../services/owl/pc/store/PcStoreFacade');
const BaseController = require('../../../base/BaseController');

class StoreController extends BaseController {
  // 店铺信息查询
  async getStoreListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const res = await new PcStoreFacade(ctx).findStore(kdtId, req);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = StoreController;
