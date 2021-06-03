const BaseController = require('../base/BaseController');
const UploadTokenFacade = require('../../services/owl/common/UploadTokenFacade');

class UploadToken extends BaseController {
  // 任务完成接口
  async getQiniuAggregateUploadToken() {
    const ctx = this.ctx;
    const {
      mediaAccessType = 1,
      mediaType = 1,
      storeType = 2,
      channel = 'owl_ceres_img',
    } = ctx.query;

    const data = await new UploadTokenFacade(ctx).getQiniuAggregateUploadToken(ctx.kdtId, {
      mediaAccessType,
      mediaType,
      storeType,
      operatorId: this.formatOperator.userId,
      ip: ctx.firstXff,
      operatorType: 2,
      channel,
    });

    return ctx.json(0, 'ok', data);
  }
}

module.exports = UploadToken;
