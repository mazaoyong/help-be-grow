const BaseController = require('../../base/BaseController');
const TeacherService = require('../../../services/owl/edu/course/TeacherService');
const TeacherFacade = require('../../../services/owl/pc/teacher/TeacherFacade');

class TeacherController extends BaseController {
  // TOCLEAR
  async getTeacherListJson(ctx) {
    const params = {
      kdtId: ctx.kdtId,
    };
    const data = await new TeacherService(ctx).getTeacherList(params);
    return ctx.json(0, 'ok', data);
  }

  // 新接口
  // 查询某个店铺下的老师信息，不分页
  // 还有其他查询老师的接口 暂时不影响
  async findTeachers(ctx) {
    const { kdtId } = ctx;
    const { keywords = null, source = 0, teacherIds = [] } = ctx.getQueryParse();
    const IPcTeacherQuery = {
      keywords,
      source,
      teacherIds,
    };
    const result = await new TeacherFacade(ctx).findTeachers(kdtId, IPcTeacherQuery);
    return ctx.success(result);
  }
}

module.exports = TeacherController;
