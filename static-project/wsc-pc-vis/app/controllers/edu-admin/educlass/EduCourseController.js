const BaseController = require('../../base/BaseController');
const EduCourseService = require('../../../services/owl/edu/educourse/EduCourseService');

class EduCourseController extends BaseController {
  async getCourseListJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new EduCourseService(ctx).findPageByCondition(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = EduCourseController;
