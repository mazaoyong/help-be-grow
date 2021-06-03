const BaseController = require('../base/BaseController');
const QiniuImageWriteService = require('../../services/common/QiniuImageWriteService');

class QiniuImageWriteController extends BaseController {
  async fetchCktImage(ctx) {
    const { categoryId, fetchUrl, title } = ctx.request.body;
    const operator = this.formatOperator;
    const params = {
      channel: 'ckt_img',
      categoryId,
      fetchUrl,
      fromApp: 'wsc-pc-vis',
      ip: operator.clientIp,
      maxSize: 30 * 1024 * 1024,
      operatorType: 2,
      operatorId: operator.userId,
      partnerBizType: 1,
      partnerBizId: ctx.kdtId,
      title,
    };
    const data = await new QiniuImageWriteService(ctx).fetchPublicImage(params);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = QiniuImageWriteController;
