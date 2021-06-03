const BaseController = require('../../controllers/base/BaseNewController');

class FooterController extends BaseController {
  async getFooterJson(ctx) {
    const kdtId = ctx.kdtId;
    const offlineId = ctx.offlineId;
    this.validator.required(kdtId, '参数 kdt_id 不能为空');
    const result = await this.callService(
      'shop.ShopFooterService',
      'getFooterInfo',
      kdtId,
      offlineId,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = FooterController;
