const DeliveryBaseController = require('./DeliveryBaseController');
const ItemQueryService = require('../../services/ic/ItemQueryService');
const FxGoodsQueryService = require('../../services/fx/FxGoodsQueryService');
const OrderDeliveryService = require('../../services/delivery/OrderDeliveryService');
const DeliveryConfigOperateService = require('../../services/delivery/DeliveryConfigOperateService');
const ElectronWayBillService = require('../../services/delivery/ElectronWayBillService');
const DeliveryOrderExpressService = require('../../services/delivery/DeliveryOrderExpressService');
const LocalPartnerService = require('../../services/delivery/LocalPartnerService');
const AppstoreAuthService = require('../../services/appstore/AppstoreAuthService');
const ExpressService = require('../../services/delivery/ExpressService');
const DeliveryOperateService = require('../../services/delivery/DeliveryOperateService');
const DeliveryQueryService = require('../../services/delivery/DeliveryQueryService');
const WechatDeliveryService = require('../../services/delivery/WechatDeliveryService');
const ShopConfigReadService = require('../../services/shop/ShopConfigReadService');
const DeliveryUtils = require('../../lib/deliveryUtils');
const { appName, sourceId } = require('../../constants');
const ShopUtils = require('@youzan/utils-shop');
const allowList = require('./allowlist');

class DeliveryController extends DeliveryBaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '发货物流';
  }

  /**
   * 1. 获取跟运费模板关联的商品列表
   * 2. 分销商品数量
   * @param {*} ctx
   */
  async getGoods(ctx) {
    const { query } = ctx;
    const kdtId = this.getKdtId(ctx);
    const { id: deliveryTemplateId, page = 1, pageSize = 5 } = query;

    this.validator.required(deliveryTemplateId, '运费模板 ID 不能为空');

    const data = await new ItemQueryService(ctx).getGoodsByTeamlateId(
      +kdtId,
      +deliveryTemplateId,
      +page,
      +pageSize,
    );
    const fxGoodsNumberResp = await new FxGoodsQueryService(ctx).getGoodsNumByFxDeliveryTemplateId(
      +kdtId,
      +deliveryTemplateId,
    );
    const fxGoodsNumber = fxGoodsNumberResp[deliveryTemplateId];
    data.fxGoodsNumber = fxGoodsNumber;

    ctx.json(0, 'ok', data);
  }

  /**
   * 第三方配送计算运费
   * @param {*} ctx
   */
  async calculateFee(ctx) {
    const { query, userId } = ctx;
    const kdtId = this.getKdtId(ctx);
    const {
      orderNo,
      distChannel,
      distWeight = 0,
      storeId = 0,
      expressId = 0,
      auditNo = '',
      deliveryType,
      appId,
      isCloudTag,
    } = query;

    this.validator.required(orderNo, '订单编号不能为空');

    const data = await new OrderDeliveryService(ctx).deliveryCalculateFee({
      kdtId: +kdtId,
      orderNo,
      storeId: +storeId,
      distChannel: +distChannel,
      distWeight: +distWeight,
      expressId: +expressId,
      deliveryType: +deliveryType,
      auditNo,
      appId,
      isCloudTag,
    });
    // 资费状态 -1：余额异常；1：余额充足；2：余额不足
    if (data.feeStatus === 2) {
      // 如果余额不足获取充值链接
      const depositUrl = await new AppstoreAuthService(ctx).useApp({
        appId,
        kdtId,
        userId,
      });
      data.depositUrl = depositUrl;
    }

    ctx.json(0, 'ok', data);
  }

  /**
   * 智慧优选计算最优推荐
   * @param {*} ctx
   */
  async calculateAlphaFee(ctx) {
    const { query } = ctx;
    const kdtId = ctx.kdtId;
    const { orderNo, alphaExpressEnable, distWeight } = query;

    this.validator.required(orderNo, '订单编号不能为空');

    const data = await new OrderDeliveryService(ctx).deliveryCalculateFee({
      kdtId: +kdtId,
      orderNo,
      alphaExpressEnable,
      distWeight,
    });

    ctx.json(0, 'ok', data);
  }

  /**
   * 更新单品多运配置（配置开启关闭）
   * @param {*} ctx
   */
  async updateSingleGoodsMultiExpressConfig(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { enable } = reqData;

    const params = {
      deliveryPoint: {
        deliveryPointId: +kdtId,
        deliveryPointType: 2,
      },
      configType: 'single_more_dist_order',
      enable,
    };

    const result = new DeliveryConfigOperateService(ctx).updateConfig(params);

    ctx.json(0, 'ok', result);
  }

  /**
   * 社群版送礼 - 整单发货
   * @param {*} ctx
   */
  async giftCommunityDelivery(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const {
      giftNo,
      orderNo,
      expressNo,
      expressId,
      expressName,
      deliveryType,
      deliveryItems,
    } = reqData;

    this.validator.required(giftNo, '礼单号不能为空');
    this.validator.required(orderNo, '订单编号不能为空');
    this.validator.required(deliveryItems, '发货商品不能为空');

    const params = {
      kdtId: +kdtId,
      deliveryItems,
      deliveryAbility: {
        multiAddress: {
          recordNo: giftNo,
        },
      },
      orderNo,
      deliveryInfo: {
        deliveryType: +deliveryType,
        express: {
          expressId: +expressId,
          expressNo,
          expressName,
        },
      },
      operator: this.operator,
      source: this.source,
    };

    const data = await new OrderDeliveryService(ctx).delivery(params);

    ctx.json(0, 'ok', data);
  }

  async getAvailableAddress(ctx) {
    const { kdtId } = ctx;
    const { expressId } = ctx.query;
    this.validator.required(expressId, '快递公司编号不能为空');
    const data = await new ElectronWayBillService(ctx).queryAvailableAddress({
      kdtId: +kdtId,
      expressId: +expressId,
    });
    ctx.json(0, 'ok', data);
  }

  async getExpressCompanies(ctx) {
    const data = await new ElectronWayBillService(ctx).queryWaybillSupportExpress();
    ctx.json(0, 'ok', data);
  }

  // 发货
  async delivery(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo, deliveryItems, deliveryInfo } = reqData;

    this.validator.required(orderNo, '订单编号不能为空');
    this.validator.required(deliveryItems, '发货商品不能为空');
    this.validator.required(deliveryInfo, '发货信息不能为空');
    this.validator.required(deliveryInfo.deliveryType, '发货类型不能为空');

    const params = {
      kdtId: +kdtId,
      deliveryItems,
      orderNo,
      deliveryInfo,
      operator: this.operator,
      source: this.source,
    };

    const data = await new OrderDeliveryService(ctx).delivery(params);

    ctx.json(0, 'ok', data);
  }

  // 取消呼叫
  async cancelCall(ctx) {
    const { kdtId } = ctx;
    const { orderNo, packId } = ctx.request.body;
    const data = await new OrderDeliveryService(ctx).cancelCall({
      kdtId: +kdtId,
      orderNo,
      packId,
      cancelReason: '',
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  // 重新打印
  async retryPrint(ctx) {
    const { kdtId } = ctx;
    const { orderId, packId, printerChannel, printerDeviceNo, printerKey } = ctx.request.body;
    const data = await new DeliveryOrderExpressService(ctx).retryPrint({
      kdtId: +kdtId,
      orderId,
      packId,
      printerDeviceNo,
      printerChannel,
      printerKey,
      sourceId: 1002, // 标记来源 - wsc
    });
    ctx.json(0, 'ok', data);
  }

  // 获取小费信息
  async getTips(ctx) {
    const localPartnerService = new LocalPartnerService(ctx);
    const shopInfo = this.ctx.getState('shopInfo');
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      fromApp: appName,
      sourceId,
      storeId: 0,
      provinceName: shopInfo.province,
      cityName: shopInfo.city,
      countyName: shopInfo.county,
      kdtId,
    });
    let partners = [];
    if (shopInfo && shopInfo.countyId > 0) {
      partners = await localPartnerService.listAllLocalPartners(params);
    }
    const cloudPartners = partners.filter(partner => {
      return partner.isCloudTag;
    });
    const channelNames = { 1: 'dada', 2: 'fengniao', 3: 'dianwoda', 11: 'dadaselfsettle' };
    const channels = Object.keys(channelNames);
    const tipParams = [];
    let tips = await Promise.all(
      channels
        .map(channel => {
          const param = {
            deliveryChannel: channel,
            appId: '',
            isCloudTag: false,
            kdtId,
          };
          tipParams.push(param);
          return localPartnerService.getTipInfo(param);
        })
        .concat(
          cloudPartners.map(partner => {
            const param = {
              deliveryChannel: 9,
              appId: partner.appId,
              isCloudTag: true,
              kdtId,
            };
            tipParams.push(param);
            return localPartnerService.getTipInfo(param);
          }),
        ),
    );
    tips = tips.reduce((acc, item, index) => {
      const param = tipParams[index] || {};
      if (param.isCloudTag) {
        acc[param.appId] = item;
        return acc;
      } else {
        const channel = item.deliveryChannel;
        const key = channelNames[channel];
        acc[key] = item;
        return acc;
      }
    }, {});
    ctx.json(0, 'ok', tips);
  }

  // 获取所有第三方渠道分段数据
  async getAllWeights(ctx) {
    const kdtId = this.getKdtId(ctx);
    const params = await DeliveryUtils.getDeliveryParams(ctx, {
      fromApp: appName,
      sourceId,
      storeId: 0,
      kdtId,
    });
    const data = await new LocalPartnerService(ctx).listAllWeightInfoWithYunApps(params);
    ctx.json(0, 'ok', data);
  }

  // 获取包裹详情
  async getPackageDetail(ctx) {
    const { kdtId } = ctx;
    const { packId } = ctx.query;
    const data = await new OrderDeliveryService(ctx).queryDistOrderByDistId({
      kdtId: +kdtId,
      packId,
      includeICDetail: false,
    });
    ctx.json(0, 'ok', data);
  }

  async getOrderCancelReasons(ctx) {
    const data = await new LocalPartnerService(ctx).getOrderCancelReasons({
      ...ctx.query, // safe done 入参无 kdtId
      fromApp: appName,
    });
    ctx.json(0, 'ok', data);
  }

  async getCancelDeductFee(ctx) {
    const data = await new LocalPartnerService(ctx).getCancelDeductFee({
      ...ctx.query, // safe done 入参无 kdtId
      fromApp: appName,
      sourceId,
    });
    ctx.json(0, 'ok', data);
  }

  async cityDetail(ctx) {
    const { kdtId } = ctx;
    const data = await new OrderDeliveryService(ctx).cityDetail({
      ...ctx.query,
      kdtId,
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  async deliveryCancelCall(ctx) {
    const { kdtId } = ctx;
    const data = await new OrderDeliveryService(ctx).deliveryCancelCall({
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  async reCall(ctx) {
    const { kdtId } = ctx;
    const data = await new OrderDeliveryService(ctx).deliveryReCall({
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  async addTip(ctx) {
    const { kdtId } = ctx;
    const data = await new OrderDeliveryService(ctx).deliveryAddTip({
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  async cancelAutoCall(ctx) {
    const { kdtId } = ctx;
    const data = await new OrderDeliveryService(ctx).cancelAutoCall({
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
    });
    ctx.json(0, 'ok', data);
  }

  async getExpressShowList(ctx) {
    const { kdtId } = ctx;
    const data = await new ExpressService(ctx).getExpressShowList(String(kdtId));
    ctx.json(0, 'ok', data);
  }

  async orderDelayReceive(ctx) {
    const { kdtId } = ctx;

    const data = await new DeliveryOperateService(ctx).orderDelayReceive({
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
      requestId: this.requestId,
    });
    ctx.json(0, 'ok', data);
  }

  async queryDelayReceiveDetail(ctx) {
    const { orderNo } = ctx.query;

    const data = await new DeliveryQueryService(ctx).queryDelayReceiveDetailByOrderNo(orderNo);
    ctx.json(0, 'ok', data);
  }

  async searchWechatDeliveryConfig(ctx) {
    const { kdtId } = ctx;
    const { includePrinterInfo, includeAllSupportDeliveryAddress } = ctx.query;
    const params = {
      kdtId,
      includePrinterInfo,
      includeAllSupportDeliveryAddress,
    };
    const config = await new WechatDeliveryService(ctx).searchWechatDeliveryConfig(params);
    ctx.json(0, 'ok', config);
  }

  async isAllowLocalExpress(ctx) {
    const { kdtId } = ctx;
    const isAllow = allowList[kdtId] ? true : false;
    ctx.json(0, 'ok', isAllow);
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
   * 获取同城能力
   * @param {AstroboyContext} ctx
   */
  async queryShopSameCityMode(ctx) {
    const { kdtId } = ctx;
    const SAME_CITY_CONFIG_KEY = 'local_delivery';
    const result = await new ShopConfigReadService(ctx).queryShopConfig(
      kdtId,
      SAME_CITY_CONFIG_KEY,
    );
    const data = result.value && +result.value;
    ctx.json(0, 'ok', data);
  }

  /**
   * 获取快递服务能力
   * @param {AstroboyContext} ctx
   */
  async queryShopExpressMode(ctx) {
    const { kdtId } = ctx;
    const EXPRESS_CONFIG_KEY = 'express_delivery';
    const result = await new ShopConfigReadService(ctx).queryShopConfig(kdtId, EXPRESS_CONFIG_KEY);
    const data = result.value && +result.value;
    ctx.json(0, 'ok', data);
  }
}

module.exports = DeliveryController;
