const OrderBaseController = require('./OrderBaseController');
const WscShopService = require('../../services/shop/WscShopService');
const OrderSearchService = require('../../services/search/OrderSearchService');
const OrderDeliveryService = require('../../services/delivery/OrderDeliveryService');
const OrderProcessService = require('../../services/order/OrderProcessService');
const OrderQueryService = require('../../services/order/OrderQueryService');
const mapKeysToSnakeCase = require('@youzan/utils/string/mapKeysToSnakeCase').default;
const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const ChainStaffService = require('../../services/sam/gateway/service/staff/ChainStaffService');
const SignleStaffService = require('../../services/sam/gateway/service/staff/SingleStaffService');
const OfflineRecepitService = require('../../services/owl/pc/offlineenrollment/OfflineReceiptFacade');
const OwlCommonService = require('../../services/owl/biz/OwlCommonFacade');
const OfflineEnrollmentGatherService = require('../../services/owl/pc/offlineenrollment/OfflineEnrollmentGatherFacade');
const OrderInfoService = require('../../services/trade/detail/OrderInfoService');
const PcOfflinePayFacade = require('../../services/owl/pc/offlineenrollment/PcOfflinePayFacade');
const SellerManagerService = require('../../services/plugin/SellerManagerService');
const PcSelfFetchService = require('../../services/ebiz/PcSelfFetchService');
const lodash = require('lodash');
const { appName } = require('../../constants');

class OrderController extends OrderBaseController {
  /**
   * 查询是否显示运费险广告
   * @param {*} ctx
   */
  async checkIsShowFreightInsuranceBanner(ctx) {
    const kdtId = ctx.kdtId;
    const userInfo = ctx.getLocalSession('userInfo');
    const userId = userInfo.id;
    const result = await new WscShopService(ctx).checkIsShowFreightInsuranceBanner(+kdtId, +userId);
    ctx.json(0, 'ok', result);
  }

  /**
   * 不再显示运费险广告
   * @param {*} ctx
   */
  async notShowFreightInsuranceBanner(ctx) {
    const kdtId = ctx.kdtId;
    const userInfo = ctx.getLocalSession('userInfo');
    const userId = userInfo.id;
    const result = await new WscShopService(ctx).notShowFreightInsuranceBanner(+kdtId, +userId);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取连锁店铺子店铺
   * @param {*} ctx
   */

  async findShopNodeList(ctx) {
    const { rootKdtId: headKdtId } = ctx.getState('shopInfo');
    const result = await new WscShopService(ctx).findShopNodeList(+headKdtId);
    ctx.json(0, 'ok', result);
  }

  /**
   * 出票
   * @param {*} ctx
   */
  async ticket(ctx) {
    const { orderNo } = ctx.request.body;
    const result = await new OrderProcessService(ctx).ticket(orderNo);
    ctx.json(0, 'ok', result);
  }

  /**
   * 根据订单号查询订单列表里面单个订单的信息
   * @param {*} ctx
   */
  async getOrderItem(ctx) {
    const { query, kdtId } = ctx;
    const { orderNo, expressType, extType, type, orderId } = query;

    const data = await new OrderSearchService(ctx).searchFormatNoCache({
      kdtId: +kdtId,
      keyword: {
        orderNo, // 订单号
        orderId, // 堂食订单用 订单Id
      },
      expressType, // 查同城配送的信息需要带上
      extType, // 查多网点相关的信息需要带上
      type, // 后端需要根据不同的订单类型去查对应的信息
    });

    // 订单号维度只能查出一个订单
    let orderItemData = Array.isArray(data.list) && data.list[0] ? data.list[0] : null;

    if (orderItemData) {
      const upperCaseData = lodash.pick(orderItemData, ['tcExtra', 'extra', 'tcTags']);
      orderItemData = lodash.omit(orderItemData, ['tcExtra', 'extra', 'tcTags']);
      orderItemData = mapKeysToSnakeCase(orderItemData);
      orderItemData = lodash.extend(orderItemData, {
        // eslint-disable-next-line camelcase
        tc_extra: upperCaseData.tcExtra,
        extra: upperCaseData.extra,
        // eslint-disable-next-line camelcase
        tc_tags: upperCaseData.tcTags,
      });

      orderItemData.permission = mapKeysToCamelCase(orderItemData.permission);

      orderItemData.tuanId = orderItemData.tuan_id;
      delete orderItemData.tuan_id;
    }

    ctx.json(0, 'ok', orderItemData);
  }

  async listInvoice(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo } = query;

    this.validator.required(orderNo, '订单编号不能为空');

    const invoiceList = await new OrderQueryService(ctx).listInvoice({ orderNo, kdtId });

    // 把蓝字的筛出来，蓝字的只有一个（目前是这样的）
    const result = lodash.find(invoiceList || [], item => item.invoiceType === 2) || null;

    ctx.json(0, 'ok', result);
  }

  async cancelOrder(ctx) {
    const kdtId = +ctx.kdtId;
    const reqData = ctx.request.body;
    const { cancelReason, orderNo } = reqData;

    this.validator.required(orderNo, '订单编号不能为空');

    const result = await new OrderProcessService(ctx).cancelOrder({
      kdtId,
      cancelReason,
      operator: this.operator,
      orderNo,
    });

    ctx.json(0, 'ok', result);
  }

  /**
   * 修改物流 - 获取包裹列表
   */
  async getExpressList(ctx) {
    const { query, kdtId } = ctx;
    const { orderNo } = query;

    this.validator.required(orderNo, '订单编号不能为空');

    let data = await new OrderDeliveryService(ctx).expressList(+kdtId, orderNo);

    if (Array.isArray(data)) {
      data = mapKeysToSnakeCase(data);
    }

    ctx.json(0, 'ok', data);
  }

  /**
   * 修改物流 - 确认修改
   * @param {*} ctx
   */
  async modifyExpress(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo, modifyDistOrderInfo } = reqData;

    const userInfo = ctx.getLocalSession('userInfo');

    this.validator.required(orderNo, '订单编号不能为空');

    const operator = {
      role: 'seller',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.id,
      operatorName: userInfo.nickName,
    };

    const source = {
      clientIp: ctx.firstXff,
      from: appName,
    };

    const data = await new OrderDeliveryService(ctx).modifyExpress({
      kdtId: +kdtId,
      orderNo,
      modifyDistOrderInfo,
      operator,
      source,
    });

    ctx.json(0, 'ok', data);
  }

  async getOrderNumAndVoice(ctx) {
    const { kdtId } = ctx;
    const { storeId = 0 } = ctx.query;
    const data = await new OrderQueryService(ctx).getOrderNumAndVoice(+kdtId, storeId);
    ctx.json(0, 'ok', data);
  }

  /**
   * 接单
   * @param {*} ctx
   */
  async confirmOrder(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo } = reqData;

    const data = await new OrderProcessService(ctx).confirmOrder({
      kdtId: +kdtId,
      orderNo,
    });

    ctx.json(0, 'ok', data);
  }

  /**
   * 拒单
   * @param {*} ctx
   */
  async rejectOrder(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo, cancelReason } = reqData;
    const params = {
      operator: this.operator,
      source: this.source,
      cancelReason,
      orderNo,
      kdtId,
    };
    const data = await new OrderProcessService(ctx).rejectOrder(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 酒店-接单
   * @param {*} ctx
   */
  async confirmHotelOrder(ctx) {
    const { kdtId, userId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo } = reqData;

    const data = await new SellerManagerService(ctx).pickOrder({
      kdtId: +kdtId,
      orderNo,
      userId,
    });

    ctx.json(0, 'ok', data);
  }

  /**
   * 酒店-拒单
   * @param {*} ctx
   */
  async rejectHotelOrder(ctx) {
    const { kdtId, userId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo } = reqData;
    const params = {
      userId,
      orderNo,
      kdtId,
    };

    const data = await new SellerManagerService(ctx).refuseOrder(params);

    ctx.json(0, 'ok', data);
  }

  /**
   * 酒店-入住
   * @param {*} ctx
   */
  async checkInHotelOrder(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo } = reqData;

    const data = await new OrderDeliveryService(ctx).confirmReceiveOrder({
      kdtId: +kdtId,
      orderNo,
      operator: this.operator,
    });

    ctx.json(0, 'ok', data);
  }

  async listRejectReasons(ctx) {
    const data = await new OrderQueryService(ctx).listRejectReasons();
    ctx.json(0, 'ok', data);
  }

  async getStaffList(ctx) {
    const { kdtId, query } = ctx;
    const queryChainStaffRequest = Object.assign({}, query, { kdtId });
    const data = await new ChainStaffService(ctx).search(queryChainStaffRequest);

    ctx.json(0, 'ok', data);
  }

  async getSingleShopStaffList(ctx) {
    const { kdtId, query } = ctx;
    const querySingleStaffRequest = Object.assign({}, query, { kdtId });
    const data = await new SignleStaffService(ctx).find(querySingleStaffRequest);

    ctx.json(0, 'ok', data);
  }

  async getByOrderNo(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo } = query;

    const data = await new OfflineRecepitService(ctx).getByOrderNo(kdtId, orderNo);
    ctx.json(0, 'ok', data);
  }

  async getReceiptV2(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo } = query;
    const data = await new OfflineRecepitService(ctx).getReceiptV2(kdtId, orderNo);
    ctx.json(0, 'ok', data);
  }

  // 获取赠品
  async getGiveawayByOrderNo(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo, chainStoreKdtId } = query;

    const data = await new OfflineEnrollmentGatherService(ctx).findGiveAway(kdtId, {
      orderNo,
      kdtId: +(chainStoreKdtId || kdtId),
    });
    ctx.json(0, 'ok', data);
  }

  // 改价弹窗获取订单价格信息
  async getPriceInfo(ctx) {
    const { kdtId } = ctx;
    const { orderNo } = ctx.query;

    const params = {
      kdtId,
      orderNo,
    };

    const result = await new OrderProcessService(ctx).changePriceWindow(params);
    ctx.json(0, 'ok', result);
  }

  // 改价
  async changePrice(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { deltaModifiedPriceDetail, deltaModifiedPrice, modifiedPostage, orderNo } = reqData;
    const params = {
      deltaModifiedPriceDetail,
      deltaModifiedPrice,
      kdtId,
      modifiedPostage,
      orderNo,
      operator: this.operator,
      requestId: this.requestId,
      source: this.source,
    };
    const data = await new OrderProcessService(ctx).changePrice(params);
    ctx.json(0, 'ok', data);
  }

  async delivery(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { callSource, deliveryInfo, wholeOrderDeliverTag, orderNo } = reqData;
    let { deliveryItems } = reqData;
    deliveryItems = lodash.toArray(deliveryItems);
    deliveryItems.forEach(item => {
      item.weight = item.weight || 0;
      if (item.itemPackList) {
        item.itemPackList = lodash.toArray(item.itemPackList);
      }
    });
    let data;
    const { deliveryType, selfFetchInfo = {} } = deliveryInfo;
    if (deliveryType === '1' || deliveryType === '2') {
      // 自提订单发货使用核销接口
      const shopInfo = ctx.getState('shopInfo');
      data = await new PcSelfFetchService(ctx).verify({
        orderNo,
        selfFetchNo: selfFetchInfo.selfFetchNo || '',
        kdtId,
        headKdtId: shopInfo.rootKdtId || kdtId,
        adminId: this.operator.operatorId,
        selfFetchType: Number(deliveryType),
      });
    } else {
      data = await new OrderDeliveryService(ctx).delivery({
        callSource,
        deliveryInfo,
        deliveryItems,
        kdtId,
        operator: this.operator,
        orderNo,
        requestId: this.requestId,
        source: this.source,
        wholeOrderDeliverTag,
      });
    }
    ctx.json(0, 'ok', data);
  }

  // 获取二维码
  async getQrcode(ctx) {
    const {
      url,
      width = 80,
      height = 80,
      isShortenUrl = false,
      errorCorrectionLevel = 3,
      deleteWhite = true,
    } = ctx.query;

    const data = await new OwlCommonService(ctx).createQrCode({
      url,
      width,
      height,
      isShortenUrl,
      errorCorrectionLevel,
      deleteWhite,
    });
    ctx.json(0, 'ok', data);
  }

  async getPrepayInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo } = ctx.query;
    const data = await new PcOfflinePayFacade(ctx).getPrepayInfo(kdtId, orderNo);
    return ctx.json(0, 'ok', data);
  }

  async getOrderInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo } = ctx.query;
    const param = {
      bizGroup: 'ebiz',
      app: 'wsc-pc-vis',
      kdtId,
      orderNo,
    };
    const data = await new OrderInfoService(ctx).get(param);
    return ctx.json(0, 'ok', data);
  }

  async getPayToolsByEduKdtId(ctx) {
    const kdtId = ctx.kdtId;
    const data = await new PcOfflinePayFacade(ctx).getPayToolsByEduKdtId(kdtId);
    return ctx.json(0, 'ok', data);
  }

  // 支付教育订单
  async pay(ctx) {
    const kdtId = ctx.kdtId;
    const pcPayCommand = ctx.request.body; // safe done 入参无需kdtId
    const data = await new PcOfflinePayFacade(ctx).pay(kdtId, pcPayCommand);
    return ctx.json(0, 'ok', data);
  }

  async deliveryWindow(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.request.body;
    const { orderNo, itemId, callSource } = reqData;
    const data = await new OrderDeliveryService(ctx).deliveryWindow({
      callSource,
      itemId,
      kdtId,
      orderNo,
    });
    ctx.json(0, 'ok', data);
  }

  async deliveryWindowGet(ctx) {
    const { kdtId } = ctx;
    const reqData = ctx.getQueryData();
    const { orderNo, itemId, callSource } = reqData;
    const data = await new OrderDeliveryService(ctx).deliveryWindow({
      callSource,
      itemId,
      kdtId,
      orderNo,
    });
    ctx.json(0, 'ok', data);
  }
}

module.exports = OrderController;
