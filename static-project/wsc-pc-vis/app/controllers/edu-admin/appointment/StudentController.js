const BaseController = require('../../base/BaseController');
const StudentService = require('../../../services/owl/pc/student/StudentService');

class StudentController extends BaseController {
  async getStudentsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new StudentService(ctx).findPageByQueryWithCustomer(kdtId, pageRequest, filter);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = StudentController;
