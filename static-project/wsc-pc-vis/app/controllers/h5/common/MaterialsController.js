const BaseController = require('../base/BaseController');
const UploadTokenService = require('../../../services/api/owl/api/UploadTokenFacade.js');

class MaterialsController extends BaseController {
  /**
   * 下载微信媒体资源，支持高保真
   */
  async highWxMediaDownLoadAsyn(ctx) {
    const {
      dpId: kdtId = 0,
      mediaId = 0,
      useHigh,
    } = ctx.query;
    const res = await new UploadTokenService(ctx).highWxMediaDownLoadAsyn(kdtId || ctx.kdtId, mediaId, useHigh);
    ctx.json(0, 'ok', res);
  }
}

module.exports = MaterialsController;
