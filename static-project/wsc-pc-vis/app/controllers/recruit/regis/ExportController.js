const BaseController = require('../../base/BaseController');
const RegisService = require('../../../services/owl/edu/RegisService');

/**
 * 预约管理-报名记录
 */
class ExportController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('recruit/regis/export.html');
  }

  /**
   * 查看已导出报表列表
   */
  async findPageExportedReportForm(ctx) {
    const { kdtId, request } = ctx;
    const { pageNumber, pageSize } = request.body;
    const reportFormQuery = {};
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };

    try {
      const res = await new RegisService(ctx).findPageExportedReportForm(
        kdtId,
        reportFormQuery,
        pageRequest,
      );
      return ctx.json(0, 'ok', res);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ExportController;
