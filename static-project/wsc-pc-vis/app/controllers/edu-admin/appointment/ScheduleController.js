const BaseController = require('../../base/BaseController');
const ScheduleService = require('../../../services/owl/pc/schedule/ScheduleService');

class ScheduleController extends BaseController {
  async getCoursesJson(ctx) {
    const { kdtId = '' } = ctx;
    const { filter = {} } = ctx.getQueryParse();

    const result = await new ScheduleService(ctx).findPageStuScheduleByStuId(kdtId, filter);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = ScheduleController;
