const BaseController = require('../base/BaseNewController');
const FansBenfitService = require('../../services/ump/details/FansBenfitService');

class FansBenfitController extends BaseController {
  // 获取携带活动信息的公众号二维码
  async getAutoReplyGoodsQrCodeJson(ctx) {
    const { kdtId } = ctx;
    const query = ctx.query;
    const params = {
      activityAlias: query.activityAlias,
      activityDesc: query.activityDesc,
      preferentialType: +query.preferentialType,
      clientType: +query.clientType,
      shopName: query.shopName,
      goodsName: query.goodsName,
      goodsAlias: query.goodsAlias,
      kdtId: +kdtId,
    };

    const result = await new FansBenfitService(ctx).getAutoReplyGoodsQrCode(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = FansBenfitController;
