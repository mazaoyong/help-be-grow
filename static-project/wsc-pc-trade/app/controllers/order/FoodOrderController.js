const OrderBaseController = require('./OrderBaseController');
const FoodOrderService = require('../../services/order/FoodOrderService');

class FoodOrderController extends OrderBaseController {
  /**
   * 堂食 - 取消订单
   * @param {*} ctx
   */
  async cancelOrder(ctx) {
    const { kdtId } = ctx;
    const { orderId, storeId } = ctx.request.body;
    const result = await new FoodOrderService(ctx).cancelOrder({
      orderId: +orderId,
      kdtId: +kdtId,
      storeId: +storeId,
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = FoodOrderController;
