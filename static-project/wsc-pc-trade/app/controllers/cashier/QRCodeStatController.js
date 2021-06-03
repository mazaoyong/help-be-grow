const BaseController = require('../base/BaseController');
const QRCodeStatService = require('../../services/datacenter/QRCodeStatService');

class QrCodePayController extends BaseController {
  /**
   * 获取收款统计概况
   * @param {AstroboyContext} ctx
   */
  async getSummary(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.query,
      kdtId,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QRCodeStatService(ctx).getSummary(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取收款统计列表(分页)
   * @param {AstroboyContext} ctx
   */
  async getPageData(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.query,
      kdtId,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QRCodeStatService(ctx).getPageData(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = QrCodePayController;
