const DeliverySettingBaseController = require('./DeliverySettingBaseController');
const ShopContactService = require('../../services/shopcenter/ShopContactService');

class SelfFetchController extends DeliverySettingBaseController {
  /**
   * @param {AstroboyContext} ctx
   */
  async getSelfFetchHtml(ctx) {
    const { kdtId } = ctx;
    await this.initWeappStatusInfo();
    await this.initWeappVersion();
    const shopContact = await new ShopContactService(ctx).queryShopContact(kdtId);
    ctx.setEnv({ shopContact });
    await ctx.render('delivery-setting/self-fetch.html');
  }
}

module.exports = SelfFetchController;
