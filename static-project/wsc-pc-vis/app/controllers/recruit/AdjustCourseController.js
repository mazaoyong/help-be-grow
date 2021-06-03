const BaseController = require('../base/BaseController');

const StudentAggregateFacade = require('../../services/owl/pc/student/StudentAggregateService');

class AdjustCourseController extends BaseController {
  // 首页
  async getIndexHtml(ctx) {
    await ctx.render('recruit/adjustcourse/index.html');
  }

  // 获取转出课程详情
  async getTransferOutCourseDetail(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};
    const data = await new StudentAggregateFacade(ctx).getTransferOutCourseDetail(kdtId, query);
    return ctx.json(0, 'ok', data);
  }

  // 转课
  async transferCourse(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};
    const data = await new StudentAggregateFacade(ctx).transferCourse(kdtId, query);
    return ctx.json(0, 'ok', data);
  }

  // 转课记录
  async getTransferCourseRecord(ctx) {
    const kdtId = ctx.kdtId;
    const data = await new StudentAggregateFacade(ctx).getTransferCourseRecord(kdtId, ctx.query);
    return ctx.json(0, 'ok', data);
  }

  // 转课凭证
  async getTransferCourseCertificate(ctx) {
    const query = ctx.request.body || {};
    const { targetKdtId = ctx.kdtId, orderNo } = query;
    const params = {
      kdtId: targetKdtId,
      orderNo,
    };
    const data = await new StudentAggregateFacade(ctx).getTransferCourseCertificate(
      ctx.kdtId,
      params,
    );
    return ctx.json(0, 'ok', data);
  }

  // 获取转出学员资产信息
  async findPageByWithSpecificCourse(ctx) {
    const { query = {}, pageRequest } = ctx.getQueryParse();
    const kdtId = ctx.kdtId;
    query.operator = this.formatOperator;
    const data = await new StudentAggregateFacade(ctx).findPageByWithSpecificCourse(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.json(0, 'ok', data);
  }
}

module.exports = AdjustCourseController;
