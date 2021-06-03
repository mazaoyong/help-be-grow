const LocalDeliveryBaseController = require('./LocalDeliveryBaseController');
const DeliverySimulationQueryService = require('../../services/alpha/DeliverySimulationQueryService');
const LocalPartnerService = require('../../services/delivery/LocalPartnerService');
const LocalDeliveryService = require('../../services/delivery/LocalDeliveryService');
const ShopContactService = require('../../services/shopcenter/ShopContactService');
const TakeoutDeliveryService = require('../../services/delivery/TakeoutDeliveryService');
const OrderDeliveryService = require('../../services/delivery/OrderDeliveryService');
const TradeLocalDeliveryService = require('../../services/delivery/TradeLocalDeliveryService');
const DeliverySettingService = require('../../services/delivery/DeliverySettingService');
const TakeoutChannelService = require('../../services/delivery/TakeoutChannelService');
const DeliveryUtils = require('../../lib/deliveryUtils');
const ShopUtils = require('@youzan/utils-shop');
const uuid = require('uuid/v4');
const { appName, sourceId } = require('../../constants');

const LOCAL_DELIVERY_SOURCE = {
  fromApp: appName,
  sourceId,
};

const STORE_ID = 0;
const SYNC_PLAN_KEY = 'warehouse-sync-plan';

class LocalDeliveryController extends LocalDeliveryBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '同城配送';
  }

  /**
   * @param {AstroboyContext} ctx
   */
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;
    const shopInfo = ctx.getState('shopInfo');
    const [isShowAutoPrintTicket, syncPlanResult, shopSupplyMode] = await Promise.all([
      // 有没有开启履约备货提醒白名单
      await this.grayRelease('delivery_stock_up', kdtId),
      // 同城预定，支持现货+无现货预定履约模式 白名单
      await this.grayRelease(SYNC_PLAN_KEY, kdtId),
      // 获取铺货/供货模式
      await this.queryShopSupplyMode(ctx),
    ]);
    ctx.setGlobal({ isShowAutoPrintTicket, syncPlanResult, shopSupplyMode: +shopSupplyMode.value });
    if (ShopUtils.checkWscHqStore(shopInfo)) {
      // 微商城连锁总部，没有同城配送页，需要重定向到微商城总部配送服务首页
      ctx.redirect('/v4/trade/hq/delivery');
    } else {
      await this.initWeappStatusInfo();
      await this.initWeappVersion();
      const shopContact = await new ShopContactService(ctx).queryShopContact(kdtId);
      ctx.setEnv({ shopContact });
      await ctx.render('local-delivery/index.html');
    }
  }

  /**
   * 仿真查询
   * @param {AstroboyContext} ctx
   */
  async querySimulation(ctx) {
    const { query } = ctx;
    const kdtId = this.getKdtId(ctx);
    const { strategyType } = query;
    const data = await new DeliverySimulationQueryService(ctx).querySimulation({
      kdtId,
      strategyType,
    });

    ctx.successRes(data);
  }

  /**
   * 获取物流服务商列表
   * @param {AstroboyContext} ctx
   */
  async getLocalPartnersListJson(ctx) {
    const kdtId = this.getKdtId(ctx);
    const { kdtId: loginKdtId } = ctx;
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...LOCAL_DELIVERY_SOURCE,
      storeId: 0,
      ...ctx.getQueryData(),
      kdtId,
      loginKdtId,
    });
    const result = await new LocalPartnerService(ctx).listAllLocalPartners(params);
    return ctx.json(0, 'ok', result);
  }

  /**
   * 申请开通服务商
   * @param {AstroboyContext} ctx
   * @memberof LocalDeliveryController
   */
  async enablePartner(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      requestId: this.requestId,
      ...LOCAL_DELIVERY_SOURCE,
      ...ctx.getPostData(),
      kdtId,
    });
    const result = await new LocalPartnerService(ctx).enablePartner(params);

    return ctx.successRes(result);
  }

  /**
   * 获取物流设置（服务开关）
   * @param {AstroboyContext} ctx
   * @memberof LocalDeliveryController
   */
  async getSetting(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      kdtId,
      fromApp: appName,
    });
    const result = await new DeliverySettingService(ctx).getSettingV3(params);
    return ctx.successRes(result);
  }

  /**
   * 更新物流设置（服务开关）
   * @param {AstroboyContext} ctx
   * @memberof LocalDeliveryController
   */
  async updateSetting(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...ctx.getPostData(),
      kdtId,
    });
    const result = await new DeliverySettingService(ctx).updateSetting(params);
    return ctx.successRes(result);
  }

  /**
   * 获取物流服务商费用信息
   * @param {AstroboyContext} ctx
   */
  async getLocalPartnerFeeInfoJson(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...LOCAL_DELIVERY_SOURCE,
      requestId: this.requestId,
      storeId: 0,
      ...ctx.getQueryData(),
      kdtId,
    });
    const result = await new LocalPartnerService(ctx).getLocalPartnerFeeInfo(params);
    return ctx.successRes(result);
  }

  /**
   * 已开通的服务商渠道的打开与关闭
   * @param {AstroboyContext} ctx
   */
  async togglePartnersJson(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...LOCAL_DELIVERY_SOURCE,
      requestId: this.requestId,
      storeId: 0,
      ...ctx.getPostData(),
      kdtId,
    });
    const result = await new LocalPartnerService(ctx).togglePartners(params);
    return ctx.successRes(result);
  }

  /**
   * 获取同城配送相关信息
   * @param {AstroboyContext} ctx
   */
  async getAllConfig(ctx) {
    // const { kdtId } = ctx;
    const kdtId = this.getKdtId(ctx);
    const configV2Params = await DeliveryUtils.getDeliveryParams(ctx, {
      kdtId,
      fromApp: appName,
    });
    const [deliveryShop, autoCallConfig, config, retailLocalDeliveryConfig] = await Promise.all([
      // 业务类型
      new TakeoutDeliveryService(ctx).findShop({
        ...LOCAL_DELIVERY_SOURCE,
        kdtId,
        storeId: STORE_ID,
      }),
      // 自动呼叫与智选配送
      new OrderDeliveryService(ctx).getAutoCallConfig({
        kdtId,
      }),
      // 配送区域与时段信息
      new LocalDeliveryService(ctx).getConfigV2New(configV2Params),
      // 自动打单设置
      new TradeLocalDeliveryService(ctx).get({
        kdtId,
        // 单店下传1/2/5都行，但是这个参数又是必传 - -
        type: 1,
        source: 'WEB_BACK_END',
      }),
    ]);
    const result = {
      config,
      autoCallConfig,
      deliveryShop,
      ticketPrintConfig: retailLocalDeliveryConfig.ticketPrintConfig,
    };
    return ctx.successRes(result);
  }

  /**
   * 保存同城配送相关信息
   * @param {AstroboyContext} ctx
   */
  async saveAllConfig(ctx) {
    const kdtId = this.getKdtId(ctx);
    const { config, autoCallConfig, ticketPrintConfig } = ctx.getPostData();
    const configV2Params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...config,
      kdtId,
      requestId: this.requestId,
    });
    const result = await Promise.all([
      // 自动呼叫与智选配送
      new OrderDeliveryService(ctx).editAutoCallConfig({
        ...autoCallConfig,
        kdtId,
        requestId: this.requestId,
      }),
      // 配送区域与时段信息
      new LocalDeliveryService(ctx).setConfigV2(configV2Params),
      // 自动打单设置
      new TradeLocalDeliveryService(ctx).updateTicket({
        ...ticketPrintConfig,
        kdtId,
        requestId: this.requestId,
        aheadTime: '' + ticketPrintConfig.aheadTime,
      }),
    ]);
    return ctx.successRes(result);
  }

  /**
   * 用户保存业务类型（第一次）
   * @param {AstroboyContext} ctx
   */
  async createLocalShop(ctx) {
    const kdtId = this.getKdtId(ctx);
    const data = ctx.getPostData();
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...LOCAL_DELIVERY_SOURCE,
      requestId: this.requestId,
      storeId: STORE_ID,
      ...data,
      kdtId,
    });
    const result = await new TakeoutDeliveryService(ctx).createLocalShop(params);

    return ctx.successRes(result);
  }

  /**
   * 用户保存业务类型（第一次）
   * @param {AstroboyContext} ctx
   */
  async updateShop(ctx) {
    const kdtId = this.getKdtId(ctx);
    const data = ctx.getPostData();
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...LOCAL_DELIVERY_SOURCE,
      requestId: this.requestId,
      storeId: STORE_ID,
      ...data,
      kdtId,
    });
    const result = await new TakeoutDeliveryService(ctx).updateShop(params);

    return ctx.successRes(result);
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

  /**
   * 获取自结算相关请求需要的参数
   * @param {AstroboyContext} ctx
   */
  getSelfSettlementParams(ctx) {
    const { kdtId } = ctx;
    const { deliveryChannel } = ctx.getRequestData();
    return {
      deliveryChannel,
      fromApp: appName,
      loginKdtId: kdtId,
      ...this.operator,
      role: 3, // seller
      requestId: uuid(),
    };
  }

  /**
   * 获取授权参数，前端通过该参数get请求，跳转到达达授权界面
   * @param {AstroboyContext} ctx
   */
  async getAuthorizeParams(ctx) {
    const params = this.getSelfSettlementParams(ctx);
    const result = await new TakeoutChannelService(ctx).getAuthorizeParams(params);
    return ctx.successRes(result);
  }

  /**
   * 解除授权
   * @param {AstroboyContext} ctx
   */
  async deAuthorize(ctx) {
    const params = this.getSelfSettlementParams(ctx);
    const result = await new TakeoutChannelService(ctx).deAuthorize(params);
    return ctx.successRes(result);
  }

  /**
   * 刷新授权结果
   * @param {AstroboyContext} ctx
   */
  async refreshAuthorizeResult(ctx) {
    const params = this.getSelfSettlementParams(ctx);
    const result = await new TakeoutChannelService(ctx).refreshAuthorizeResult(params);
    return ctx.successRes(result);
  }

  /**
   * 绑定或者换绑门店
   * @param {AstroboyContext} ctx
   */
  async saveOrUpdateBandShop(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      ...this.getSelfSettlementParams(ctx),
      ...ctx.getPostData(),
      ...LOCAL_DELIVERY_SOURCE,
      kdtId,
      storeId: 0,
    });
    const result = await new TakeoutChannelService(ctx).saveOrUpdateBandShop(params);
    return ctx.successRes(result);
  }
}

module.exports = LocalDeliveryController;
