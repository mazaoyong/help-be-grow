const BaseController = require('../base/BaseController');
const CommonFacade = require('../../services/owl/pc/onlinecourse/CommonFacade');
const AppStatusRemoteFacade = require('../../services/yop/AppStatusRemoteService');
const OwlCommonService = require('../../services/owl/biz/OwlCommonService');

class ShopController extends BaseController {
  async checkAuth(ctx) {
    const result = await new CommonFacade(ctx).checkAuth(ctx.kdtId);
    ctx.json(0, 'ok', result);
  }

  async getPlugStat(ctx) {
    const { kdtId } = ctx;
    const { appId } = ctx.getQueryParse();
    const result = await new AppStatusRemoteFacade(ctx).getAppStatusWithBasic(kdtId, Number(appId));
    ctx.json(0, 'ok', result);
  }

  // 获取店铺H5二维码
  async getWapQrCode(ctx) {
    const params = ctx.query;
    const queryData = {
      width: 540,
      height: 540,
      isShortenUrl: true,
      errorCorrectionLevel: 1,
      ...params,
    };

    const res = await new OwlCommonService(ctx).createQrCode(queryData);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ShopController;
