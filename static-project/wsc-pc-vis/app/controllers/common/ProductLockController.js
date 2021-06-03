const BaseController = require('../base/BaseController');
const PcProductLockFacade = require('../../services/owl/pc/courseitem/product/PcProductLockFacade');

class ProductLockController extends BaseController {
  async getLockTypes(ctx) {
    const { alias } = ctx.request.query || {};
    const data = await new PcProductLockFacade(ctx).findLockTypes(ctx.kdtId, alias);

    ctx.set('x-course-new-api', 'yes');
    return ctx.json(0, 'ok', data);
  }

  async listLockTypesGroup(ctx) {
    const { aliases } = ctx.request.body || {};
    const data = await new PcProductLockFacade(ctx).findLockTypeListByAliases(ctx.kdtId, aliases);
    const lockDataMap = {};
    data.forEach(item => {
      lockDataMap[item.alias] = item.pcLockTypes;
    });

    ctx.set('x-course-new-api', 'yes');
    return ctx.json(0, 'ok', lockDataMap);
  }
}

module.exports = ProductLockController;
