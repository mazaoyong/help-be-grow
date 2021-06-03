const BaseController = require('../base/BaseController');
const SellerOrderService = require('../../services/fx/SellerOrderService');
const SellerOrderExportService = require('../../services/fx/OrderExportService');

class FxSellerListController extends BaseController {
  async index(ctx) {
    /**
     * 分销相关业务已从pc-trade迁出至pc-fenxiao
     * 导航更新时间: 2020-08-21
     * 重定向逻辑: 2020-08-26
     */
    super.redirectToNewestUrl(this.ctx);
    await ctx.render('fxseller/list.html');
  }

  async getPurchaseOrderList(ctx) {
    const { kdtId } = ctx;
    const { orderTimeBegin, orderTimeEnd, orderBy, order, ...query } = ctx.getQueryData();
    const params = {
      orderTime: {
        begin: orderTimeBegin,
        end: orderTimeEnd,
      },
      orderBy: {
        key: orderBy,
        order,
      },
      ...query,
      kdtId,
    };
    const result = await new SellerOrderService(ctx).getPurchaseOrderList(params);
    ctx.json(0, 'ok', result);
  }

  /** 根据分销单主动支付采购单 */
  async payPurchaseOrder(ctx) {
    const { kdtId } = ctx;
    const { orderNos = [] } = ctx.request.body;
    const params = {
      kdtId,
      orderNos,
    };
    const result = await new SellerOrderService(ctx).activePayPurchaseOrder(params);
    ctx.json(0, 'ok', result);
  }

  /** 根据分销单，批量查询采购单主动付款信息 */
  async getActivePayInfo(ctx) {
    const { kdtId } = ctx;
    const { orderNos = [] } = ctx.request.body;
    const params = {
      kdtId,
      orderNos,
    };
    const result = await new SellerOrderService(ctx).getActivePayInfoByBuyerOrders(params);
    ctx.json(0, 'ok', result);
  }

  /** 查询采购单批量支付结果 */
  async getActivePayProcessInfo(ctx) {
    const { activePayId } = ctx.query;
    const result = await new SellerOrderService(ctx).getActivePayProcessInfo(activePayId);
    ctx.json(0, 'ok', result);
  }

  /** 分销采购单导出接口 */
  async exportFxOrder(ctx) {
    const { kdtId } = ctx;
    const { beginTime, endTime } = ctx.request.body;
    const userInfo = ctx.getLocalSession('userInfo');
    const params = {
      beginTime,
      endTime,
      kdtId,
      account: userInfo.account,
      nickName: userInfo.nickName,
    };
    const result = await new SellerOrderExportService(ctx).export(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = FxSellerListController;
