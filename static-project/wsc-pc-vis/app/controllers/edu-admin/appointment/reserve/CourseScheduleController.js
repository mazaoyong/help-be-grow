const BaseController = require('../../../base/BaseController');
const CourseScheduleService = require('../../../../services/owl/edu/CourseScheduleService');

class CourseScheduleController extends BaseController {
  // 查询预约列表
  async getListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).list({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 查询预约看板数据
  async getCourseScheduleKanbanJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).getCourseScheduleKanban({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 导出预约列表数据
  async exportDataJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).exportData({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 查询不同预约状态的数量
  async getCountStatusJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).countStatus({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 新增预约
  async addReserveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).create({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 更新预约
  async updateReserveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new CourseScheduleService(ctx).update({
      ...req,
      kdtId,
    });

    return ctx.json(0, 'ok', res);
  }

  // 查询课程详情
  async getSimpleCourseDetailJson(ctx) {
    const kdtId = ctx.kdtId;
    const { courseAlias } = ctx.request.query || {};

    const res = await new CourseScheduleService(ctx).getSimpleCourseDetail(kdtId, courseAlias);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = CourseScheduleController;
