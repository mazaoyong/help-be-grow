const BaseController = require('../base/BaseController');
const ChainShopQueryService = require('../../services/owl/pc/shop/ChainShopQueryService');

class ChainShopQueryController extends BaseController {
  // 根据校区kdtIds批量查询校区店铺基础信息
  async findListByKdtIds(ctx) {
    const { kdtId } = ctx;
    const shopChainInfoQuery = ctx.getQueryParse();

    const res = await new ChainShopQueryService(ctx).findListByKdtIds(kdtId, shopChainInfoQuery);

    ctx.json(0, 'ok', res);
  }
}

module.exports = ChainShopQueryController;
