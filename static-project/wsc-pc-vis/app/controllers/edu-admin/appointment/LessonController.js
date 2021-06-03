const BaseController = require('../../base/BaseController');
const LessonService = require('../../../services/owl/pc/lesson/LessonService');
const StudentLessonDetectService = require('../../../services/owl/pc/lesson/StudentLessonDetectService');

class LessonController extends BaseController {
  async getLessonsJson(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async getLessonByPage(ctx) {
    const { kdtId = '' } = ctx;
    const { query = {}, pageSize, pageNumber } = ctx.getQueryParse();
    const result = await new LessonService(ctx).findAppointmentPage(
      kdtId,
      {
        pageSize,
        pageNumber,
        sort: {
          orders: [
            {
              property: 'start_time',
              direction: 'ASC',
            },
          ],
        },
      },
      query,
    );
    return ctx.json(0, 'ok', result);
  }

  async getDaysJson(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentDateListV2(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async getAddressJson(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx.getQueryParse();

    const result = await new LessonService(ctx).findAppointmentAddressList(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  async detectDateRange(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();

    const result = await new StudentLessonDetectService(ctx).detectDateRange(kdtId, query);
    return ctx.json(0, 'ok', result);
  }
}

module.exports = LessonController;
