const BaseController = require('../../../base/BaseController');
const CourseService = require('../../../../services/owl/edu/CourseService');

class CourseController extends BaseController {
  // 查询课程详情 TOCLEAR
  async getCoursePCDetailJson(ctx) {
    const kdtId = ctx.kdtId;
    const { alias } = ctx.request.query || {};

    const res = await new CourseService(ctx).getCoursePCDetail({ kdtId, alias });

    return ctx.json(0, 'ok', res);
  }
}

module.exports = CourseController;
