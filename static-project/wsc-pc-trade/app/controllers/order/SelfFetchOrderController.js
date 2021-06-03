const OrderBaseController = require('./OrderBaseController');
const ShopConfigWriteService = require('../../services/shop/ShopConfigWriteService');
const MultiStoreSettingService = require('../../services/multistore/MultiStoreSettingService');
const { appName } = require('../../constants');

class SelfFetchOrderController extends OrderBaseController {
  // 设置店铺核销设置
  async setWriteOffConfig(ctx) {
    const kdtId = ctx.kdtId;
    const userInfo = ctx.getLocalSession('userInfo');
    const writeOffType = ctx.request.body.selfWriteOffType;
    const params = this._convertParams(kdtId, userInfo, writeOffType);
    const result = await new ShopConfigWriteService(ctx).setShopConfig(params);
    ctx.json(0, 'ok', result);
  }
  /**
   * 获取自主核销设置
   * @param {AstroboyContext} ctx
   */
  async getWriteOffConfig(ctx) {
    const { kdtId } = ctx;
    const setting = await new MultiStoreSettingService(ctx).getMultiStoreSettingsByKdtId(kdtId);
    ctx.successRes(Boolean(setting.selfWriteOffType));
  }
  _convertParams(kdtId, userInfo, writeOffType) {
    return {
      kdtId,
      key: 'self_write_off_type',
      operator: {
        fromApp: appName,
        id: userInfo.id,
        name: userInfo.nickName,
      },
      value: writeOffType,
    };
  }
}

module.exports = SelfFetchOrderController;
