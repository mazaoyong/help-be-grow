const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const OrderBaseController = require('./OrderBaseController');
const FxOrderExportService = require('../../services/fx/OrderExportService');
const OrderExportService = require('../../services/ebiz/OrderExportService');

/**
 * @typedef {import('../../../definitions/order/export-list').IListReq} IListReq
 * @typedef {import('../../../definitions/order/export-list').IFxListReq} IFxListReq
 */

class ExportListController extends OrderBaseController {
  /**
   * 已生成报表页
   * @param {*} ctx
   */
  async getIndexHtml(ctx) {
    await this.initStoreId();
    await this.initTeamAdmin();
    await ctx.render('order/export-list.html');
  }

  /**
   * 获取订单报表列表
   *
   * @param {*} ctx
   * @returns
   */
  async getListJson(ctx) {
    /**
     * @type {IListReq}
     */
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const { page = 1, size = 20 } = query;
    const result = await new OrderExportService(ctx).listExportRecord({
      kdtId,
      bizType: 'order',
      page,
      size,
      isScroll: true,
    });
    return ctx.successRes(mapKeysToCamelCase(result));
  }

  /**
   * 获取分销订单报表列表
   *
   * @param {*} ctx
   * @returns
   */
  async getFxListJson(ctx) {
    /**
     * @type {IFxListReq}
     */
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const { page = 1, size: pageSize = 20 } = query;
    const result = await new FxOrderExportService(ctx).queryList({
      kdtId,
      page,
      pageSize,
    });
    return ctx.successRes(result);
  }
}

module.exports = ExportListController;
