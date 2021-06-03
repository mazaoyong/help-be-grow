const BaseController = require('../../base/BaseController');
const OnlineCourseFacade = require('../../../services/owl/pc/onlinecourse/CourseFacade');

class OnlineCourseController extends BaseController {
  // 学习记录页学习明细列表
  async findDetail(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse() || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(pageRequest, '分页参数不能为空');
    this.validator.required(query, '参数 query 不能为空');

    const res = await new OnlineCourseFacade(ctx).findDetail(kdtId, pageRequest, query);

    return ctx.json(0, 'ok', res);
  }

  // 个人学习记录页学习明细列表
  async findUserLearnDetail(ctx) {
    const kdtId = ctx.kdtId;
    const { pageRequest, query } = ctx.getQueryParse() || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(query, '参数 query 不能为空');
    this.validator.required(pageRequest, '分页参数不能为空');

    const res = await new OnlineCourseFacade(ctx).findUserLearnDetail(kdtId, pageRequest, query);

    return ctx.json(0, 'ok', res);
  }

  // 个人学习记录页数据统计
  async getUserOverview(ctx) {
    const kdtId = ctx.kdtId;
    const { query } = ctx.getQueryParse() || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(query, '参数 query 不能为空');

    const res = await new OnlineCourseFacade(ctx).getUserOverview(kdtId, query);

    return ctx.json(0, 'ok', res);
  }

  // 学习记录页数据统计
  async getOverview(ctx) {
    const kdtId = ctx.kdtId;
    const { courseType, courseId } = ctx.getQueryParse() || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(courseType, '参数 courseType 不能为空');
    this.validator.required(courseId, '参数 courseId 不能为空');

    const res = await new OnlineCourseFacade(ctx).getOverview(kdtId, courseType, courseId);

    return ctx.json(0, 'ok', res);
  }

  // 学习记录页数据趋势
  async getTrend(ctx) {
    const kdtId = ctx.kdtId;
    const { query } = ctx.getQueryParse() || {};
    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(query, '参数 query 不能为空');

    const res = await new OnlineCourseFacade(ctx).getTrend(kdtId, query);

    return ctx.json(0, 'ok', res);
  }

  // 学习记录页导出
  async exportTask(ctx) {
    const kdtId = ctx.kdtId;
    const { query } = ctx.getQueryParse() || {};
    const { nickName, mobile } = this.formatOperator;
    const params = {
      ...query,
      operatorName: nickName,
      operatorMobile: mobile,
    };

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(query, '参数 query 不能为空');

    const res = await new OnlineCourseFacade(ctx).exportTask(kdtId, params);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = OnlineCourseController;
