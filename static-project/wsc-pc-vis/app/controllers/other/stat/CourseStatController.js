const BaseController = require('./StatBaseController');
const ApplyDataService = require('../../../services/owl/pc/datacenter/ApplyDataFacade');

class CourseStatController extends BaseController {
  async getIndexHtml(ctx) {
    await Promise.all([
      this.getDayDataReadyProgress(ctx, 'APPLY'),
      this.getMonthDataReadyProgress(ctx, 'APPLY'),
    ]);

    await ctx.render('other/stat/course.html');
  }

  // 报名概览
  async getOverview(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const res = await new ApplyDataService(ctx).getOverview(kdtId, {
      dateParam,
      kdtParam,
    });
    ctx.success(res);
  }

  // 课程收款分布
  async getCoursePaidAmount(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const { courseIds } = ctx.getQueryParse();
    const res = await new ApplyDataService(ctx).getCoursePaidAmount(kdtId, {
      dateParam,
      kdtParam,
      courseIds: courseIds ? courseIds.split(',') : [],
    });
    ctx.success(res);
  }

  // 报名学员构成
  async getStudentPaidAmount(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const res = await new ApplyDataService(ctx).getStudentPaidAmount(kdtId, {
      dateParam,
      kdtParam,
    });
    ctx.success(res);
  }

  // 课时销售表
  async findCourseAssetPaidByPage(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    let {
      name,
      page,
      sortBy,
      sortType,
    } = ctx.getQueryParse();

    this.validator
      .isNumeric(page, '无效的参数 page');

    if (!sortType) {
      sortBy = 'PAID_AMOUNT';
      sortType = 'DESC';
    }

    const res = await new ApplyDataService(ctx).findCourseAssetPaidByPage(kdtId, {
      pageNumber: page,
      pageSize: 10,
      sort: {
        orders: [{
          property: sortBy,
          direction: sortType,
        }],
      },
    }, {
      dateParam,
      kdtParam,
      name,
    });
    ctx.success(res);
  }

  // 课时销售表总计
  async findCourseAssetPaidTotal(ctx) {
    const { dateParam, kdtParam, kdtId } = this.getQueryParams(ctx);
    const { name } = ctx.getQueryParse();
    const res = await new ApplyDataService(ctx).findCourseAssetPaidTotal(kdtId, {
      dateParam,
      kdtParam,
      name,
    });
    ctx.success(res);
  }
}

module.exports = CourseStatController;
