const ExpressBaseController = require('./ExpressBaseController');
const TemplateService = require('../../services/delivery/TemplateService');
const DeliverySettingService = require('../../services/delivery/DeliverySettingService');
const TradeSettingService = require('../../services/trade/business/TradeSettingService');
const RegionService = require('../../services/delivery/RegionService');
const RegionV3Service = require('../../services/delivery/RegionV3Service');
const ExpressDeliveryService = require('../../services/delivery/ExpressDeliveryService');
const DeliveryUtils = require('../../lib/deliveryUtils');
const ShopUtils = require('@youzan/utils-shop');
const { appName } = require('../../constants');

class ExpressController extends ExpressBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '快递发货';
  }

  /**
   * @param {AstroboyContext} ctx
   */
  async getExpressHtml(ctx) {
    const { url } = ctx;
    const kdtId = this.getKdtId(ctx);
    const shopInfo = ctx.getState('shopInfo');
    // 有没有开启履约备货提醒白名单
    const isShowAutoPrintTicket = await this.grayRelease('delivery_stock_up', kdtId);
    ctx.setGlobal({ isShowAutoPrintTicket });
    if (ShopUtils.checkWscHqStore(shopInfo)) {
      // 微商城连锁总部，/v4/trade/express(.*)需要重定向到微商城总部相应的运费模板页
      const reg = new RegExp('/v4/trade/express(.*)');
      const redirectUrl = url.replace(reg, (_, route) => `/v4/trade/hq/delivery/template${route}`);
      ctx.redirect(redirectUrl);
    } else {
      await this.initWeappStatusInfo();
      await this.initWeappVersion();
      ctx.setGlobal({ templateType: 3 });
      await ctx.render('express/index.html');
    }
  }

  async listTemplates(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.query,
      kdtId,
      fromApp: appName,
    });
    const data = await new TemplateService(ctx).listTemplates(params);

    ctx.json(0, '', data);
  }

  async getSettingV3(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.query,
      kdtId,
      fromApp: appName,
    });
    const data = await new DeliverySettingService(ctx).getSettingV3(params);
    ctx.json(0, '', data);
  }

  async updateSetting(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.request.body,
      kdtId,
    });
    const data = await new DeliverySettingService(ctx).updateSetting(params);

    ctx.json(0, '', data);
  }

  async getTemplateDetail(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.query,
      fromApp: appName,
      kdtId,
    });
    const data = await new TemplateService(ctx).getTemplateDetail(params);

    ctx.json(0, '', data);
  }

  async create(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.request.body,
      kdtId,
    });
    const data = await new TemplateService(ctx).create(params);

    ctx.json(0, '', data);
  }

  async update(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.request.body,
      kdtId,
    });
    const data = await new TemplateService(ctx).update(params);

    ctx.json(0, '', data);
  }

  async replicate(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.query,
      kdtId,
    });
    const data = await new TemplateService(ctx).replicate(params);

    ctx.json(0, '', data);
  }

  async replicatePost(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.request.body,
      kdtId,
    });
    const data = await new TemplateService(ctx).replicate(params);

    ctx.json(0, '', data);
  }

  async deleteTemp(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.request.body,
      kdtId,
    });
    const data = await new TemplateService(ctx).deleteTemp(params);

    ctx.json(0, '', data);
  }

  async getTradeSetting(ctx) {
    const kdtId = this.getKdtId(ctx);
    const { rootKdtId } = ctx.getState('shopInfo');
    const data = await new TradeSettingService(ctx).getSettingByKdtId({
      kdtId,
      headKdtId: rootKdtId,
    });

    ctx.json(0, '', data);
  }

  async getRegionPartitions(ctx) {
    const data = await new RegionService(ctx).getRegionPartitions(ctx.query); // safe done 废弃无调用, kibana 七天无流量
    return ctx.json(0, '', data);
  }

  async getAllIdNameMap(ctx) {
    const data = await new RegionV3Service(ctx).getAllIdNameMap({
      ...ctx.query, // safe done 无 kdtId
      fromApp: 'wsc',
    });
    ctx.json(0, '', data);
  }

  async queryTicketprint(ctx) {
    const kdtId = this.getKdtId(ctx);
    const data = await new ExpressDeliveryService(ctx).get({
      ...ctx.query,
      kdtId,
      fromApp: 'wsc',
    });
    ctx.json(0, '', data);
  }

  async updateTicketprint(ctx) {
    const kdtId = this.getKdtId(ctx);
    const data = await new ExpressDeliveryService(ctx).updateTicket({
      ...ctx.request.body,
      kdtId,
      fromApp: 'wsc',
    });
    ctx.json(0, '', data);
  }

  /**
   * 获取kdtId
   * @param {AstroboyContext} ctx
   */
  getKdtId(ctx) {
    const { kdtId } = ctx;
    // safe done ctx.originQuery
    const query = ctx.originQuery;
    const body = ctx.originBody;
    const shopInfo = ctx.getState('shopInfo');

    if (ShopUtils.checkHqStore(shopInfo)) {
      return Number(body.kdtId || query.kdtId || kdtId);
    }

    return kdtId;
  }
}

module.exports = ExpressController;
