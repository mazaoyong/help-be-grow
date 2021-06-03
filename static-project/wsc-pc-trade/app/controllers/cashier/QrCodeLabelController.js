const BaseController = require('../base/BaseController');
const QrCodeLabelService = require('../../services/trade/business/qrcode/QrCodeLabelService');

class QrCodeLabelController extends BaseController {
  /**
   * 获取二维码标签列表(分页)
   * @param {AstroboyContext} ctx
   */
  async getQrLabelList(ctx) {
    const { kdtId } = ctx;

    const params = {
      ...ctx.query,
      kdtId,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }

    const result = await new QrCodeLabelService(ctx).qrLabelList(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取二维码标签列表(不分页)
   * @param {AstroboyContext} ctx
   */
  async getQrLabelItems(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.query,
      kdtId,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeLabelService(ctx).labelItems(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 添加二维码标签
   * @param {AstroboyContext} ctx
   */
  async addQrLabel(ctx) {
    const { kdtId, userId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      userId,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeLabelService(ctx).addQrLabel(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 更新二维码标签
   * @param {AstroboyContext} ctx
   */
  async updateQrLabel(ctx) {
    const { kdtId, userId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      userId,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeLabelService(ctx).updateQrLabel(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 删除二维码标签
   * @param {AstroboyContext} ctx
   */
  async deleteQrLabel(ctx) {
    const { kdtId, userId } = ctx;
    const params = {
      ...ctx.request.body,
      delete: true,
      kdtId,
      userId,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      params.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeLabelService(ctx).deleteQrLabel(params);
    ctx.json(0, 'ok', result);
  }
}
module.exports = QrCodeLabelController;
