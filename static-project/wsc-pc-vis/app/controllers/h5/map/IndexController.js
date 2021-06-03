const BaseController = require('../base/BaseController');
const StoreService = require('../../../services/owl/edu/StoreService');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/map.html');
  }

  async getStoreListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    try {
      req.storeIds = JSON.parse(req.storeIds || '[]');
    } catch (err) {}

    const res = await new StoreService(ctx).listStoreForB({ ...req, kdtId });

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
