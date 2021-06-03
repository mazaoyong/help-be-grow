const BaseController = require('./StatBaseController');
const TeachDataService = require('../../../services/owl/pc/datacenter/TeachDataFacade');

class ConsumeStatController extends BaseController {
  async getIndexHtml(ctx) {
    await Promise.all([
      this.getDayDataReadyProgress(ctx, 'CONSUMECLASS'),
      this.getMonthDataReadyProgress(ctx, 'CONSUMECLASS'),
    ]);

    await ctx.render('other/stat/consume.html');
  }

  async getConsumeClassOverview(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const res = await new TeachDataService(ctx).getConsumeClassOverview(kdtId, {
      dateParam,
      kdtParam,
    });
    ctx.success(res);
  }

  async findConsumeClassDetailPage(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const {
      dataType,
      pageNumber,
      sortBy,
      sortType,
    } = ctx.getQueryParse();

    this.validator
      .isNumeric(dataType, '无效的参数 dataType')
      .isNumeric(pageNumber, '无效的参数 pageNumber');

    const res = await new TeachDataService(ctx).findConsumeClassDetailPage(kdtId, {
      pageNumber,
      pageSize: 20,
      sort: {
        orders: sortBy && sortType ? [{
          direction: sortType,
          property: sortBy,
        }] : [],
      },
    }, {
      dateParam,
      kdtParam,
      dataType,
    });
    ctx.success(res);
  }

  async exportConsumeClassDetail(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx, 'post');
    const { dataType } = ctx.getPostData();
    const operator = this.formatOperator;

    const res = await new TeachDataService(ctx).exportConsumeClassDetail(kdtId, {
      dateParam,
      kdtParam,
      dataType,
      operateName: operator.nickName,
      operateMobile: operator.mobile,
    });
    ctx.success(res);
  }
}

module.exports = ConsumeStatController;
