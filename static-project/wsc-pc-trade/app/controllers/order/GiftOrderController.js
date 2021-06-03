const OrderBaseController = require('./OrderBaseController');
const GiftOrderService = require('../../services/trade/business/GiftOrderService');
const MultiAddressQueryService = require('../../services/trade/dc/MultiAddressQueryService');
const ChildOrderService = require('../../services/trade/business/ChildOrderService');

class ExportController extends OrderBaseController {
  /**
   * 分页获取订单列表
   * @param {*} ctx
   */
  async queryGiftOrderInfoPage(ctx) {
    const { orderNo, pageNo, pageSize } = ctx.query;
    const params = {
      orderNo,
      pageSize: +pageSize,
      pageNo: +pageNo,
    };
    const result = await new GiftOrderService(ctx).queryGiftOrderInfoPage(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 查询物流信息
   * @param {*} ctx
   */
  async queryDistOrderByRecordNo(ctx) {
    const { includeICDetail, orderNo, recordNo } = ctx.request.body;

    const params = {
      includeICDetail,
      orderNo,
      recordNo,
    };
    const result = await new MultiAddressQueryService(ctx).queryDistOrderByRecordNo(params);
    ctx.json(0, 'ok', result);
  }

  /**
   * 分页获取订单列表
   * @param {*} ctx
   */
  async queryChildOrderList(ctx) {
    const { kdtId } = ctx;
    const { orderNo, pageNo, pageSize } = ctx.query;
    const params = {
      kdtId,
      parentOrderNo: orderNo,
      pageSize: +pageSize,
      pageNo: +pageNo,
      withChildAddress: true,
    };
    const result = await new ChildOrderService(ctx).queryChildOrderList(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ExportController;
