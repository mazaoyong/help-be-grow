const { checkEduChainStore } = require('@youzan/utils-shop');
const BaseController = require('./StatBaseController');
const TeachDataService = require('../../../services/owl/pc/datacenter/TeachDataFacade');

class AttendanceStatController extends BaseController {
  async getIndexHtml(ctx) {
    await Promise.all([
      this.getDayDataReadyProgress(ctx, 'ATTENDANCE'),
      this.getMonthDataReadyProgress(ctx, 'ATTENDANCE'),
    ]);

    await ctx.render('other/stat/attendance.html');
  }

  async getExportHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('ump/record/index.html');
  }

  async getAttendanceOverview(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);

    const res = await new TeachDataService(ctx).getAttendanceOverview(kdtId, {
      dateParam,
      kdtParam,
    });
    ctx.success(res);
  }

  async findAttendClassDetailPage(ctx) {
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

    const res = await new TeachDataService(ctx).findAttendClassDetailPage(kdtId, {
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

  async exportAttendClassDetail(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx, 'post');
    const { dataType } = ctx.getPostData();
    const operator = this.formatOperator;

    this.validator
      .isNumeric(dataType, '无效的参数 dataType');

    const res = await new TeachDataService(ctx).exportAttendClassDetail(kdtId, {
      dateParam,
      kdtParam,
      dataType,
      operateName: operator.nickName,
      operateMobile: operator.mobile,
    });
    ctx.success(res);
  }
}

module.exports = AttendanceStatController;
