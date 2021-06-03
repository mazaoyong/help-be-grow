const BaseController = require('./OrderBaseController');
const RefundQueryService = require('../../services/fx/RefundQueryService');
const RefundOrderQueryService = require('../../services/safeguard/RefundOrderQueryService');
const OrderQueryService = require('../../services/order/OrderQueryService');
const OrderDeliveryService = require('../../services/delivery/OrderDeliveryService');
const OwlOrderInfoFacade = require('../../services/owl/pc/order/OwlOrderInfoFacade');
const RefundFacade = require('../../services/owl/pc/refund/RefundFacade');
const SellerRefundService = require('../../services/ebiz/SellerRefundService');
const BuyGivePresentFacade = require('../../services/owl/pc/buygive/BuyGivePresentFacade');
const { appName } = require('../../constants');

class OrderDetailController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '订单详情';
  }

  async getIndexHtml(ctx) {
    await Promise.all([
      this.initStoreId(),
      this.initTeamAdmin(),
      this.initVersionStatus(),
      // 初始化多网点开关状态
      this.initIsShowMultiStore(),
      this.initWechatDeliveryWhiteList(ctx),
    ]);

    await ctx.render('order/detail.html');
  }

  async getShareOfRefundFee(ctx) {
    const { kdtId } = ctx;
    const { orderNo, orderItemId, refundFee } = ctx.query;
    this.validator.required(orderNo, '订单编号不能为空');
    this.validator.required(orderItemId, '采购单商品 orderItemId 不能为空');
    const data = await new RefundQueryService(ctx).getFxRefundableFeeByPurchaseOrder({
      kdtId,
      orderItemId,
      orderNo,
      refundFee: +refundFee,
    });

    return ctx.successRes(data);
  }

  // 获取订单详情数据
  async getOrderDetail(ctx) {
    const { kdtId } = ctx;
    const { orderNo, withCustomInfo = false, storeId = 0 } = ctx.query;

    const params = {
      kdtId,
      orderNo,
      withChildInfo: true,
      withRemark: true,
      withItemInfo: true,
      withPaymentInfo: true,
      withSourceInfo: true,
      withOrderAddressInfo: true,
      withBuyerInfo: true,
      withMainOrderInfo: true,
      withCustomInfo,
    };

    // 网店管理员的shopId
    if (storeId > 0) {
      params.shopId = storeId;
    }

    const result = await new OrderQueryService(ctx).getOrderDetailFormat(params);

    return result;
  }

  async getOrderDetailJson(ctx) {
    const result = await this.getOrderDetail(ctx);
    return ctx.successRes(result);
  }

  // 订单退款信息
  async getRefundListJson(ctx) {
    const { kdtId } = ctx;
    const { orderNo } = ctx.query;

    const result = await new RefundOrderQueryService(ctx).getByOrderNo({
      kdtId,
      orderNo,
    });
    return ctx.successRes(result);
  }

  // 获取收货地址
  async getLogistics(ctx) {
    const { kdtId } = ctx;
    const { orderNo } = ctx.query;
    const params = {
      kdtId,
      orderNo,
    };

    const result = await new OrderDeliveryService(ctx).logisticsQueryByOrderNo(params);
    return ctx.successRes(result);
  }

  // 收货地址修改接口
  async updateLogistics(ctx) {
    const { kdtId } = ctx;
    const {
      receiverName,
      deliveryStreet,
      deliveryProvince,
      deliveryPostalCode,
      deliveryCountry,
      deliveryDistrict,
      orderNo,
      deliveryCity,
      receiverTel,
    } = ctx.request.body;

    const result = await new OrderDeliveryService(ctx).updateLogistics({
      kdtId,
      orderNo,
      deliveryStreet,
      deliveryProvince,
      deliveryPostalCode,
      deliveryCountry,
      deliveryDistrict,
      deliveryCity,
      receiverTel,
      receiverName,
      operator: this.operator,
    });
    return ctx.successRes(result);
  }

  // 发货单列表信息
  async getDeliveryList(ctx) {
    const { kdtId } = ctx;
    const { orderNo } = ctx.query;
    const result = await new OrderDeliveryService(ctx).listDistOrderByOrderNo({
      kdtId,
      orderNo,
    });
    return ctx.successRes(result);
  }

  // 知识课程类订单详情专用接口
  async getEduDetailByOrderNo(ctx) {
    const { kdtId } = ctx;
    const { orderNo } = ctx.query;
    const result = await new OwlOrderInfoFacade(ctx).getByOrderNo(kdtId, orderNo, {
      includeMain: true,
    });
    return ctx.successRes(result);
  }

  // 退课
  async refund(ctx) {
    const refundCommand = ctx.request.body; // safe done 入参无 kdtId
    refundCommand.operatorId = this.operator.operatorId;
    refundCommand.operatorName = this.operator.operatorName;
    const result = await new RefundFacade(ctx).refundV2(ctx.kdtId, refundCommand);
    return ctx.successRes(result);
  }

  // 赠品列表
  async findBuyGivePresentPageByCondition(ctx) {
    const { orderNo, pageNumber = 1, pageSize = 10 } = ctx.getQueryData();
    const query = {
      orderNo,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [],
      },
    };
    const result = await new BuyGivePresentFacade(ctx).findPageByCondition(
      ctx.kdtId,
      query,
      pageRequest,
    );
    return ctx.successRes(result);
  }

  /**
   * 获取卡券列表
   * @param ctx
   * @returns {Promise<void>}
   */
  async queryTicketsList(ctx) {
    const { kdtId } = ctx;
    const { orderNo, page, pageSize } = ctx.getQueryData();

    const result = await new SellerRefundService(ctx).queryTicketsList({
      kdtId,
      orderNo,
      page,
      pageSize,
    });
    return ctx.successRes(result);
  }

  /**
   * 获取订单实际可退金额
   * @param {Context} ctx
   * @returns {Promise<void>}
   */
  async getRefundableFee(ctx) {
    const { kdtId } = ctx;
    const { itemId, orderNo } = ctx.getQueryData();

    this.injectRefundScContext(orderNo);

    const result = await new SellerRefundService(ctx).getRefundableFee({
      itemId,
      kdtId,
      orderNo,
    });
    return ctx.successRes(result);
  }

  /**
   * 主动退款查询订单是否需要取消同城送
   * @param {Context} ctx
   */
  async queryCancelDistOrderInfo(ctx) {
    const { kdtId } = ctx;
    const { itemId, orderNo } = ctx.getQueryData();
    const result = await new SellerRefundService(ctx).queryCancelDistOrderInfo({
      itemId,
      kdtId,
      orderNo,
    });
    return ctx.successRes(result);
  }

  /**
   * 商家主动退款or标记退款
   * @param {Context} ctx
   * @returns {Promise<void>}
   */
  async activeRefundBySeller(ctx) {
    const { kdtId } = ctx;
    const { operatorId } = this.operator;
    const {
      orderNo,
      itemId,
      refundFee,
      disabledTicketCount,
      couponIds,
      distId,
      needCancelDistOrder,
      refundNum,
      refundItems,
    } = ctx.request.body;
    const source = {
      clientIp: ctx.firstXff,
      from: appName,
    };

    const param = {
      kdtId,
      operatorId,
      source,
      orderNo,
      itemId,
      refundFee,
      disabledTicketCount,
      couponIds,
      distId,
      needCancelDistOrder,
      refundNum,
      scOperatorStr: this.scOperatorStr,
    };

    if (refundItems) {
      try {
        param.refundItems = JSON.parse(refundItems);
      } catch (e) {
        ctx.logger.warn('商家主动退款整单参数错误');
      }
    }

    this.injectRefundScContext(orderNo);

    const result = await new SellerRefundService(ctx).activeRefundBySeller(param);
    return ctx.successRes(result);
  }

  /**
   * 兼容云业务身份 - 该逻辑由 iron 移植过来
   */
  injectRefundScContext(orderNo) {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo');

    try {
      ctx.registerServiceChain('business_identity', {
        kdtId: ctx.kdtId,
        userId: userInfo.id,
        clientType: 'pc',
        pageName: 'orderRefund',
        orderNo,
      });
    } catch (e) {
      ctx.logger.warn('主动退款注入 sc 上下文失败：injectRefundScContext');
    }
  }
}

module.exports = OrderDetailController;
