const BaseController = require('../../../controllers/h5/base/BaseController');
const WeappQRCodeService = require('../../../services/channels/WeappQRCodeService');
const OwlCommonService = require('../../../services/owl/biz/OwlCommonService');

class QrcodeController extends BaseController {
  // 通用生成小程序码接口
  async getCommonWeappCode() {
    const ctx = this.ctx;
    let targetUrl = ctx.query.targetUrl || {};
    let page = ctx.query.page || '';
    let params = {
      targetUrl,
      kdtId: ctx.kdtId,
      page,
    };
    params = JSON.stringify(params);
    const weappQRCodeService = new WeappQRCodeService(ctx);
    const data = await weappQRCodeService.getCodeUltra(ctx.kdtId, 'pages/common/blank-page/index', params);
    ctx.json(0, 'ok', 'data:image/png;base64,' + data.imageBase64);
  }

  async getQrcodeJson(ctx) {
    const params = ctx.query;
    const queryData = {
      width: 280,
      height: 280,
      isShortenUrl: false,
      ...params,
    };

    const result = await new OwlCommonService(ctx).createQrCode(queryData);
    ctx.json(0, 'ok', result);
  }
}

module.exports = QrcodeController;
