const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const BaseController = require('../base/BaseController');
const OrderExportService = require('../../services/ebiz/OrderExportService');

class ExportListController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('refund/export-list.html');
  }

  /**
   * 获取售后导出记录列表
   *
   * @param {*} ctx
   * @returns
   */
  async getListJson(ctx) {
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const { page = 1, size = 20 } = query;
    const result = await new OrderExportService(ctx).listExportRecord({
      kdtId,
      bizType: 'refund',
      page,
      size,
      isScroll: true,
    });
    return ctx.successRes(mapKeysToCamelCase(result));
  }
}

module.exports = ExportListController;
