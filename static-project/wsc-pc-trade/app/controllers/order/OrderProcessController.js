const OrderBaseController = require('./OrderBaseController');
const OrderProcessService = require('../../services/order/OrderProcessService');
const GoodsOrderExpressService = require('../../services/delivery/GoodsOrderExpressService');

class OrderProcessController extends OrderBaseController {
  /**
   * 超卖订单补货
   * @param {*} ctx
   */
  async overSaleRestock(ctx) {
    const { orderNo } = ctx.getPostData();
    const { kdtId } = ctx;

    const param = {
      kdtId,
      orderNo,
      operator: this.operator,
      source: this.source,
      remark: '超卖订单商家确认补货',
    };
    const result = await new OrderProcessService(ctx).overSaleOrderRestock(param);

    return ctx.successRes(result);
  }

  /**
   * 超卖订单退款
   * @param {*} ctx
   */
  async overSaleRefund(ctx) {
    const { orderNo } = ctx.getPostData();
    const { kdtId } = ctx;

    const param = {
      kdtId,
      orderNo,
      operator: this.operator,
      source: this.source,
      cancelReason: '超卖订单取消',
    };
    const result = await new OrderProcessService(ctx).overSaleOrderRefund(param);

    return ctx.successRes(result);
  }

  /**
   * 周期购-发货记录
   * @param {*} ctx
   */
  async periodDeliveryRecords(ctx) {
    const { kdtId } = ctx;
    const result = await new OrderProcessService(ctx).periodDeliveryRecords({
      ...ctx.request.query,
      kdtId,
      operator: this.operator,
      source: this.source,
    });

    return ctx.successRes(result);
  }

  /**
   * 周期购-查看配送日历
   * @param {*} ctx
   */
  async periodCalendar(ctx) {
    const { kdtId } = ctx;
    const result = await new OrderProcessService(ctx).periodCalendar({
      ...ctx.request.query,
      kdtId,
      operator: this.operator,
      source: this.source,
    });

    return ctx.successRes(result);
  }

  /**
   * 周期购-确认改期
   * @param {*} ctx
   */
  async periodChangeDate(ctx) {
    const { kdtId } = ctx;
    const result = await new OrderProcessService(ctx).periodChangeDate({
      ...ctx.getPostData(),
      kdtId,
      operator: this.operator,
      source: this.source,
    });

    return ctx.successRes(result);
  }

  /**
   * 周期购-恢复配送
   * @param {*} ctx
   */
  async periodRecoverySend(ctx) {
    const { kdtId } = ctx;
    const result = await new OrderProcessService(ctx).periodRecoverySend({
      ...ctx.getPostData(),
      kdtId,
      operator: this.operator,
      source: this.source,
    });

    return ctx.successRes(result);
  }

  /**
   * 根据物流单号及快递公司id查物流轨迹
   * @param {*} ctx
   */
  async getDeliveryInfo(ctx) {
    const query = ctx.request.query;
    const expressNo = query.expressNo;
    const expressId = Number(query.expressId);
    let result = false;
    if (expressNo && expressId) {
      result = await new GoodsOrderExpressService(ctx).getDeliveryInfo(expressNo, expressId);
    }
    return ctx.successRes(result);
  }
}

module.exports = OrderProcessController;
