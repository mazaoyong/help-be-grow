const BaseController = require('./StatBaseController');
const ClueDataService = require('../../../services/owl/pc/datacenter/ClueDataFacade');

class ClueStatController extends BaseController {
  async getIndexHtml(ctx) {
    await Promise.all([
      this.getDayDataReadyProgress(ctx, 'CLUE'),
      this.getMonthDataReadyProgress(ctx, 'CLUE'),
    ]);

    await ctx.render('other/stat/clue.html');
  }

  async getOverview(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const res = await new ClueDataService(ctx).getOverview(kdtId, {
      dateParam,
      kdtParam,
    });
    ctx.success(res);
  }

  async getSourceAnalyse(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const {
      dataType,
      statType,
      sourceIdList,
    } = ctx.getQueryParse();

    this.validator
      .isNumeric(dataType, '无效的参数 dataType')
      .required(statType, '参数 statType 不能为空');

    const res = await new ClueDataService(ctx).getSourceAnalyse(kdtId, {
      dateParam,
      dataType,
      kdtParam,
      statType,
      sourceIdList: sourceIdList ? sourceIdList.split(',') : [],
    });
    ctx.success(res);
  }

  async getCVRAnalyse(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const { srcId, srcGroupId } = ctx.getQueryParse();
    const res = await new ClueDataService(ctx).getCVRAnalyse(kdtId, {
      dateParam,
      kdtParam,
      srcId,
      srcGroupId,
    });
    ctx.success(res);
  }
}

module.exports = ClueStatController;
