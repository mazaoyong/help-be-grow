const BaseController = require('../../base/BaseController');
const LessonService = require('../../../services/owl/pc/lesson/LessonService');

class LessonController extends BaseController {
  async getRecordsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findPageByCondition(kdtId, pageRequest, {
      ...query,
    });
    return ctx.json(0, 'ok', result);
  }
}

module.exports = LessonController;
