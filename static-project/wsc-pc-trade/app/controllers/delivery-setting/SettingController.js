const DeliverySettingBaseController = require('./DeliverySettingBaseController');
const ShopContactService = require('../../services/shopcenter/ShopContactService');
const ShopBaseReadService = require('../../services/shopcenter/ShopBaseReadService');
const ShopMetaReadOuterService = require('../../services/shopcenter/ShopMetaReadOuterService');
const WscChainReadService = require('../../services/shopcenter/WscChainReadService');
const ShopUtils = require('@youzan/utils-shop');

class SettingController extends DeliverySettingBaseController {
  /**
   * @param {AstroboyContext} ctx
   */
  async getSettingHtml(ctx) {
    const kdtId = this.getKdtId(ctx);
    const hqKdtId = ctx.kdtId;
    await this.initWeappStatusInfo();
    await this.initWeappVersion();
    // 同城配送tab需要shopContact, shopInfo
    const [subShopInfo, shopContact, shopInfo, shopMetaInfo] = await Promise.all([
      new WscChainReadService(ctx).querySubShop(hqKdtId, kdtId),
      new ShopContactService(ctx).queryShopContact(kdtId),
      new ShopBaseReadService(ctx).getShopBaseInfoByKdtId(kdtId), // 获取店铺信息
      new ShopMetaReadOuterService(ctx).queryShopMetaInfo(kdtId),
    ]);
    shopInfo.county = shopInfo.area;
    const templateType = 2;
    ctx.setEnv({
      templateType,
      shopContact,
      shopInfo: { ...shopInfo, ...shopMetaInfo },
      subShopInfo,
      wscHqDeliverySetting: true,
    });
    await ctx.render('delivery-setting/setting.html');
  }
  /**
   * 获取kdtId
   * @param {AstroboyContext} ctx
   */
  getKdtId(ctx) {
    const { kdtId } = ctx;
    // safe done ctx.originQuery
    const query = ctx.originQuery;
    const shopInfo = ctx.getState('shopInfo');

    if (ShopUtils.checkHqStore(shopInfo)) {
      return Number(query.kdtId || kdtId);
    }

    return kdtId;
  }
}

module.exports = SettingController;
