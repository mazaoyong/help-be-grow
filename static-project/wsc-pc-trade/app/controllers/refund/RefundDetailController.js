const BaseController = require('../base/BaseController');
const RefundOperateBySellerService = require('../../services/refund/RefundOperateBySellerService');
const SellerExchangeService = require('../../services/exchangeGoods/SellerExchangeService');
const ReturnOrderService = require('../../services/retail/ReturnOrderService');
const { appName } = require('../../constants');
const utilsShop = require('@youzan/utils-shop');
const { BusinessException } = require('@youzan/wsc-pc-base');

class RefundDetailController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = '售后详情';
  }

  // 操作人
  get operator() {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo');
    const operator = {
      role: 'seller',
      operatorId: userInfo.id,
    };
    return operator;
  }

  // 来源
  get source() {
    const { ctx } = this;
    const source = {
      app: appName,
      clientIp: ctx.firstXff,
      from: appName,
    };
    return source;
  }

  /**
   * 兼容云业务身份 - 该逻辑由 iron 移植过来
   */
  injectRefundScContext(orderNo) {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo');

    try {
      const params = {
        kdtId: ctx.kdtId,
        userId: userInfo.id,
        clientType: 'pc',
        pageName: 'orderRefund',
        orderNo,
      };

      ctx.registerServiceChain('business_identity', params);
    } catch (e) {
      ctx.logger.warn('同意退款注入 sc 上下文失败：injectRefundScContext');
    }
  }

  async getIndexHtml(ctx) {
    await Promise.all([this.initStoreId(), this.initTeamAdmin()]);

    await ctx.render('refund/detail.html');
  }

  // 退款详情
  async getDetailJson(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { orderNo, refundId = null, itemId = null, bizSource } = ctx.query;

    this.validator.required(orderNo, '订单编号不能为空');
    const result = await new RefundOperateBySellerService(ctx).refundDetail({
      kdtId,
      orderNo,
      refundId,
      itemId,
      operator: this.operator,
      bizSource,
    });

    const shopInfo = ctx.getState('shopInfo');
    const REFUND_AND_RETURN = 2; // 退货退款
    if (utilsShop.checkUnifiedShop(shopInfo) && result.demand === REFUND_AND_RETURN) {
      const refundDetail = await new ReturnOrderService(ctx).getRefundDetail({
        kdtId,
        adminId,
        retailSource: this.source.from,
        orderNo,
        refundId: result.refundId,
        tcOrderItemId: itemId,
      });
      result.needHandleReturnStockIn = refundDetail.needHandleReturnStockIn;
    }
    return ctx.successRes(result);
  }

  // 发布留言
  async postMessage(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId, message, extInfo } = ctx.request.body;

    const result = await new RefundOperateBySellerService(ctx).refundMessage({
      kdtId,
      orderNo,
      refundId,
      message,
      extInfo,
      operator: this.operator,
      source: this.source,
    });
    return ctx.successRes(result);
  }

  // 退款前请求
  async preCheck(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundType, refundId = null } = ctx.query;

    const result = await new RefundOperateBySellerService(ctx).preCheck({
      kdtId,
      orderNo,
      refundType,
      refundId,
    });
    return ctx.successRes(result);
  }

  // 同意退款
  async accept(ctx) {
    const { kdtId } = ctx;
    const { values } = ctx.request.body;
    let params = {};

    try {
      params = JSON.parse(values);
    } catch (e) {
      this.ctx.logger.warn('参数错误', '售后详情解析同意退款参数 values 错误 ', values);
      throw new BusinessException(50000401, '参数错误');
    }

    Object.assign(params, {
      kdtId,
      operator: this.operator,
      source: this.source,
      scOperatorStr: this.scOperatorStr,
    });

    this.injectRefundScContext(params.orderNo);

    const result = await new RefundOperateBySellerService(ctx).accept(params);
    return ctx.successRes(result);
  }

  // 拒绝退款
  async reject(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId, remark } = ctx.request.body;

    const result = await new RefundOperateBySellerService(ctx).reject({
      kdtId,
      orderNo,
      refundId,
      remark,
      operator: this.operator,
      source: this.source,
      scOperatorStr: this.scOperatorStr,
    });
    return ctx.successRes(result);
  }

  // 确认收货并退款
  async sign(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId } = ctx.request.body;

    this.injectRefundScContext(orderNo);

    const result = await new RefundOperateBySellerService(ctx).sign({
      kdtId,
      orderNo,
      refundId,
      operator: this.operator,
      source: this.source,
      scOperatorStr: this.scOperatorStr,
    });
    return ctx.successRes(result);
  }

  // 拒绝确认收货(退货流程)
  async unsign(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId } = ctx.request.body;

    const result = await new RefundOperateBySellerService(ctx).unsign({
      kdtId,
      orderNo,
      refundId,
      remark: '未收货，拒绝退款',
      operator: this.operator,
      source: this.source,
      scOperatorStr: this.scOperatorStr,
    });
    return ctx.successRes(result);
  }

  /**
   * 同意换货
   * @param {Context} ctx
   */
  async exchangeAgree(ctx) {
    const { kdtId } = ctx;
    const params = {
      ...ctx.request.body,
      kdtId,
      operator: this.operator,
      source: this.source,
      clientIp: ctx.firstXff,
    };

    const result = await new SellerExchangeService(ctx).exchangeAgree(params);
    return ctx.successRes(result);
  }

  /**
   * 拒绝换货
   * @param {Context} ctx
   */
  async exchangeReject(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId, remark, version } = ctx.request.body;

    const result = await new SellerExchangeService(ctx).exchangeReject({
      kdtId,
      orderNo,
      refundId,
      remark,
      operator: this.operator,
      clientIp: ctx.firstXff,
      version,
    });
    return ctx.successRes(result);
  }

  /**
   * 确认收货并发货(换货流程)
   * @param {Context} ctx
   */

  async deliveryExchangeGoods(ctx) {
    const { kdtId } = ctx;
    const { orderNo, companyCode, logisticsNo, refundId, version } = ctx.request.body;

    const result = await new SellerExchangeService(ctx).exchangeGoodsReturnAgree({
      kdtId,
      orderNo,
      refundId,
      companyCode,
      logisticsNo,
      operator: this.operator,
      clientIp: ctx.firstXff,
      version,
    });
    return ctx.successRes(result);
  }

  /**
   * 拒绝确认收货(换货流程)
   * @param {Context} ctx
   */

  async exchangeUnsign(ctx) {
    const { kdtId } = ctx;
    const { orderNo, refundId, version, remark } = ctx.request.body;

    const result = await new SellerExchangeService(ctx).exchangeGoodsReturnReject({
      kdtId,
      orderNo,
      refundId,
      remark,
      operator: this.operator,
      clientIp: ctx.firstXff,
      version,
    });
    return ctx.successRes(result);
  }

  // 查询下一单
  async queryNext(ctx) {
    const { kdtId } = ctx;
    const { createTime } = ctx.request.query;
    const shopInfo = ctx.getState('shopInfo');

    const params = {
      kdtId,
      createTime: +createTime,
    };

    // 是否连锁总店
    if (utilsShop.checkHqStore(shopInfo)) {
      params.headKdtId = shopInfo.rootKdtId;
      delete params.kdtId;
    }

    const result = await new RefundOperateBySellerService(ctx).queryNextRefund(params);
    return ctx.successRes(result);
  }
}

module.exports = RefundDetailController;
