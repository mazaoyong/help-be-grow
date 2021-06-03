const BaseController = require('../base/BaseController');
const TradeSettingService = require('../../services/ebiz/TradeSettingService');
const ShopConfigReadService = require('../../services/shop/ShopConfigReadService');
const { checkChainStore } = require('@youzan/utils-shop');

class VerifycardController extends BaseController {
  async setGlobalFunc(ctx) {
    const shopInfo = ctx.getState('shopInfo');

    await this.initStoreId();
    await this.initTeamAdmin();
    await this.getRetailShopRoles(ctx);
    await this.queryTicketsByPhoneAbilityCheck();

    if (checkChainStore(shopInfo)) {
      await this.setHqShopInfo(ctx);
    }
  }

  async getVerifyHtml(ctx) {
    await this.setGlobalFunc(ctx);
    await ctx.render('verifycard/verify-tool.html');
  }

  async getRecordExportHtml(ctx) {
    await ctx.render('verifycard/export-list.html');
  }

  async queryTicketsByPhoneAbilityCheck() {
    const { ctx } = this;
    const { kdtId } = ctx;
    /**
     * 是否在允许手机号搜索卡券的店铺白名单内
     */
    try {
      const KEY = 'query_tickets_by_phone';
      const result = await new ShopConfigReadService(ctx).queryShopConfig(kdtId, KEY);
      const allowQueryTicketsByPhone = result.value === '1';
      ctx.setGlobal('allowQueryTicketsByPhone', allowQueryTicketsByPhone);
    } catch (e) {
      ctx.setGlobal('allowQueryTicketsByPhone', false);
    }
  }

  /**
   * 获取跨店核销设置(包含所有交易设置字段)
   */
  async getVerifyConfig(ctx) {
    const { kdtId } = ctx;
    const params = {
      kdtId,
      source: 'merchant-pc',
    };
    const data = await new TradeSettingService(ctx).get(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 更新跨店核销设置(包含所有交易设置字段)
   */
  async updateVerifyConfig(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      source: 'merchant-pc',
      adminId,
    };

    const data = await new TradeSettingService(ctx).update(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = VerifycardController;
