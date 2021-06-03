const BaseController = require('../../../base/BaseController');
const StudentService = require('../../../../services/owl/edu/StudentService');
const StudentAggregateService = require('../../../../services/owl/pc/student/StudentAggregateService');

class StudentController extends BaseController {
  // 根据手机号模糊查询
  async getCustomerStudentListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};

    const res = await new StudentService(ctx).getCustomerStudentList({ ...req, kdtId });

    return ctx.json(0, 'ok', res);
  }

  // 新建学生
  async createStudentJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};

    const res = await new StudentService(ctx).createStudent({ ...req, kdtId });

    return ctx.json(0, 'ok', res);
  }

  // 查找日程下学员列表
  async findPageByQueryWithSingleSchedule(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query } = ctx.getQueryParse();

    const res = await new StudentAggregateService(ctx).findPageByQueryWithSingleSchedule(
      kdtId,
      pageRequest,
      query,
    );
    return ctx.json(0, 'ok', res);
  }
}

module.exports = StudentController;
