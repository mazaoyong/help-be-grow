const BaseController = require('../../../base/BaseController');
const TeacherFacade = require('../../../../services/owl/pc/teacher/TeacherFacade');

class TeacherController extends BaseController {
  async getTeacherListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    const res = await new TeacherFacade(ctx).findTeachers(kdtId, req);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = TeacherController;
