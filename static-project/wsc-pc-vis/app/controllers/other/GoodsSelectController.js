const BaseController = require('../base/BaseController');
const GoodsSelectorConfigService = require('../../services/ump/manage/GoodsSelectorConfigService');

class GoodsSelectorController extends BaseController {
  async getIndexHTML(ctx) {
    // 获取商品选择器配置
    const gsConfig = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
      shopId: ctx.kdtId,
      domain: 'UMP',
      umpType: 22,
    });

    ctx.setGlobal('gsConfig', gsConfig);
    await ctx.render('other/goods-select/index.html');
  }
}

module.exports = GoodsSelectorController;
