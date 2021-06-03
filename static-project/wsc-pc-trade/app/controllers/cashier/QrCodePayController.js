const BaseController = require('../base/BaseController');
const QrCodePayQueryService = require('../../services/trade/business/qrcode/QrCodePayQueryService');

class QrCodePayController extends BaseController {
  /**
   * 获取收款列表
   * @param {AstroboyContext} ctx
   */
  async getQrCodePayList(ctx) {
    const { kdtId } = ctx;

    const params = {
      ...ctx.query,
      kdtId,
      // 1 时间降序 2 时间升序
      pageOrderType: 2,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodePayQueryService(ctx).queryQrCodePayList(params);
    ctx.json(0, 'ok', result);
  }
}
module.exports = QrCodePayController;
