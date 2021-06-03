const SelfFetchBaseController = require('./SelfFetchBaseController');
const SelfFetchPointService = require('../../services/self-fetch/SelfFetchPointService');
const SelfFetchPointApiService = require('../../services/self-fetch/SelfFetchPointApiService');
const SelfFetchService = require('../../services/delivery/SelfFetchService');
const DeliverySettingService = require('../../services/delivery/DeliverySettingService');
const ShopMetaReadOuterService = require('../../services/shopcenter/ShopMetaReadOuterService');
const ShopUtils = require('@youzan/utils-shop');
const DeliveryUtils = require('../../lib/deliveryUtils');
const { appName } = require('../../constants');

const SYNC_PLAN_KEY = 'warehouse-sync-plan';

class SelfFetchController extends SelfFetchBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '上门自提';
  }

  /**
   * @param {AstroboyContext} ctx
   */
  async getIndexHtml(ctx) {
    const kdtId = this.getKdtId(ctx);
    const shopInfo = ctx.getState('shopInfo');
    const [isShowAutoPrintTicket, syncPlanResult, shopSupplyMode] = await Promise.all([
      // 有没有开启履约备货提醒白名单
      await this.grayRelease('delivery_stock_up', kdtId),
      // 同城预定，支持现货+无现货预定履约模式 白名单
      await this.grayRelease(SYNC_PLAN_KEY, kdtId),
      // 获取铺货/供货模式
      await this.queryShopSupplyMode(ctx),
    ]);
    // 有没有开启履约备货提醒白名单
    ctx.setGlobal({ isShowAutoPrintTicket, syncPlanResult, shopSupplyMode: +shopSupplyMode.value });
    if (ShopUtils.checkWscHqStore(shopInfo)) {
      // 微商城连锁总部，没有上门自提页，需要重定向到微商城总部配送服务首页
      ctx.redirect('/v4/trade/hq/delivery');
    } else if (ShopUtils.checkWscBranchStore(shopInfo)) {
      // 微商城连锁门店 重定向到微商城连锁门店的上门自提页
      ctx.redirect('/v4/trade/branch/delivery/setting/self-fetch');
    } else {
      // 其他类型的不变，渲染之前的上门自提页
      await this.initWeappStatusInfo();
      await this.initWeappVersion();
      await ctx.render('self-fetch/index.html');
    }
  }
  /**
   * 获取自提设置
   * @param {AstroboyContext} ctx
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
   * 更新自提设置
   * @param {AstroboyContext} ctx
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
   * 根据kdtId查询零售店铺是否有自提点
   * @param {AstroboyContext} ctx
   */
  async hasSelfFetchPoints(ctx) {
    const kdtId = this.getKdtId(ctx);
    const result = await new SelfFetchPointService(ctx).hasSelfFetchPoints(kdtId);
    ctx.successRes(result);
  }
  /**
   * 微商城后台分页查询自提点列表
   * @param {AstroboyContext} ctx
   */
  async fetchSelfFetchPoints(ctx) {
    const { kdtId, isSuperStore } = ctx;
    const service = new SelfFetchPointService(ctx);
    let result;
    if (isSuperStore) {
      result = await service.listRetailSelfFetchPoints({
        ...ctx.getRequestData(),
        kdtId,
      });
    } else {
      result = await service.listByPage({
        ...ctx.getRequestData(),
        kdtId,
      });
    }
    ctx.successRes(result);
  }
  /**
   * 创建自提点
   * @param {AstroboyContext} ctx
   */
  async createSelfFetchPoint(ctx) {
    const kdtId = this.getKdtId(ctx);
    const requestData = ctx.getRequestData();
    const info = requestData.info;
    const setting = requestData.setting;
    const ticketPrintConfig = requestData.ticketPrintConfig;
    const operator = this.getOperator(ctx);
    const shopMetaInfo = await new ShopMetaReadOuterService(ctx).queryShopMetaInfo(kdtId);
    const isWscChainStore = ShopUtils.checkWscChainStore(shopMetaInfo);
    const { rootKdtId: headId } = ctx.getState('shopInfo');
    let selfFetchPointId;
    if (!isWscChainStore) {
      selfFetchPointId = await new SelfFetchPointService(ctx).create({
        ...info,
        kdtId,
        operator,
      });
    }
    const offlineData = isWscChainStore ? {} : { offlineId: selfFetchPointId };
    // 更新自提设置
    const settingRes = await Promise.all([
      new SelfFetchService(ctx).setSelfFetchTimeConfig({
        ...offlineData,
        ...setting,
        headId,
        operatorKdtId: ctx.kdtId,
        kdtId,
        operator,
        fromApp: appName,
      }),
      ticketPrintConfig &&
        new SelfFetchPointApiService(ctx).updateTicket({
          kdtId,
          ...ticketPrintConfig,
          aheadTime: '' + ticketPrintConfig.aheadTime,
          selfFetchPointId,
        }),
    ]);

    if (isWscChainStore) {
      ctx.successRes(settingRes);
    } else {
      ctx.successRes(selfFetchPointId && settingRes);
    }
  }
  /**
   * 删除自提点
   * @param {AstroboyContext} ctx
   */
  async deleteSelfFetchPoint(ctx) {
    const { kdtId } = ctx;
    const operator = this.getOperator(ctx);
    const res = await new SelfFetchPointService(ctx).delete({
      operatorId: operator.operatorId,
      ...ctx.getRequestData(),
      kdtId,
    });
    ctx.successRes(res);
  }
  /**
   * 修改自提点
   * @param {AstroboyContext} ctx
   */
  async updateSelfFetchPoint(ctx) {
    const kdtId = this.getKdtId(ctx);
    const requestData = ctx.getRequestData();
    const info = requestData.info;
    const setting = requestData.setting;
    const ticketPrintConfig = requestData.ticketPrintConfig;
    const operator = this.getOperator(ctx);
    const shopMetaInfo = await new ShopMetaReadOuterService(ctx).queryShopMetaInfo(kdtId);
    const isWscChainStore = ShopUtils.checkWscChainStore(shopMetaInfo);
    const { rootKdtId: headId } = ctx.getState('shopInfo');
    let infoRes;
    if (!isWscChainStore) {
      infoRes = await new SelfFetchPointService(ctx).update({
        ...info,
        kdtId,
        operator,
      });
    }
    const offlineData = isWscChainStore ? {} : { offlineId: info.id };
    // 更新自提设置
    const settingRes = await Promise.all([
      new SelfFetchService(ctx).setSelfFetchTimeConfig({
        ...offlineData,
        ...setting,
        headId,
        operatorKdtId: ctx.kdtId,
        kdtId,
        operator,
        fromApp: appName,
      }),
      ticketPrintConfig &&
        new SelfFetchPointApiService(ctx).updateTicket({
          kdtId,
          ...ticketPrintConfig,
          aheadTime: '' + ticketPrintConfig.aheadTime,
          selfFetchPointId: isWscChainStore ? 0 : info.id,
        }),
    ]);

    if (isWscChainStore) {
      ctx.successRes(settingRes);
    } else {
      ctx.successRes(infoRes && settingRes);
    }
  }
  /**
   * 根据kdtId查询自提点
   * @param {AstroboyContext} ctx
   */
  async getSelfFetchPoint(ctx) {
    const kdtId = this.getKdtId(ctx);
    const { userId: adminId } = ctx;
    const requestData = ctx.getRequestData();
    const storeId = Number(requestData.storeId);
    const shopMetaInfo = await new ShopMetaReadOuterService(ctx).queryShopMetaInfo(kdtId);
    const isWscChainStore = ShopUtils.checkWscChainStore(shopMetaInfo);
    const isRetailSingleStore = ShopUtils.checkRetailSingleStore(shopMetaInfo);
    const { rootKdtId: headId } = ctx.getState('shopInfo');

    let info;
    if (isWscChainStore) {
      info = {
        id: kdtId,
      };
    } else {
      info = await new SelfFetchPointService(ctx).getSelfFetchPoint({
        kdtId,
        storeId,
      });
    }
    // 查询自提设置
    const [setting, retailSelfFetchConfig] = await Promise.all([
      new SelfFetchService(ctx).getSelfFetchTime({
        fromApp: appName,
        headId,
        operatorKdtId: ctx.kdtId,
        kdtId,
        offlineId: isWscChainStore ? 0 : storeId,
      }),
      isRetailSingleStore &&
        new SelfFetchPointApiService(ctx).querySelfFetchPoint({
          kdtId,
          // 单店下传1/2/5都行，但是这个参数又是必传 - -
          type: 1,
          adminId,
          retailSource: 'WEB-RETAIL-AJAX',
          source: 'WEB_BACK_END',
          selfFetchPointId: isWscChainStore ? 0 : storeId,
        }),
    ]);

    ctx.successRes({
      info,
      setting,
      ticketPrintConfig: retailSelfFetchConfig ? retailSelfFetchConfig.ticketPrintConfig : null,
    });
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

  // 获取operator
  getOperator(ctx) {
    const userInfo = ctx.getLocalSession('userInfo');
    return {
      clientIp: ctx.firstXff,
      fromApp: appName,
      nickName: userInfo.nickName,
      operatorId: userInfo.id,
      userId: String(userInfo.id),
    };
  }
}

module.exports = SelfFetchController;
