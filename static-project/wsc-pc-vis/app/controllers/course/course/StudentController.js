const BaseController = require('../../base/BaseController');
const StudentService = require('../../../services/owl/edu/course/StudentService');

class StudentController extends BaseController {
  async getRegisterInfo(ctx) {
    const params = {
      ...ctx.query,
      kdtId: ctx.kdtId,
    };
    const data = await new StudentService(ctx).getRegisterInfo(params);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = StudentController;
