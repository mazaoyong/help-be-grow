const BaseController = require('../base/BaseNewController');
const StudentLessonFacade = require('../../services/owl/client/edu/student/StudentLessonFacade');
const ConsumerAppointmentFacade = require('../../services/owl/client/edu/appointment/ConsumerAppointmentFacade');

class ApplyResultController extends BaseController {
  async findLockedPage(ctx) {
    const kdtId = ctx.kdtId;
    const {
      pageSize,
      page,
      assetNos,
      startTime,
      endTime,
    } = ctx.getQueryParse();

    const result = await new StudentLessonFacade(ctx).findLockedPage(kdtId, {
      pageSize: pageSize,
      pageNumber: page,
      sort: {
        orders: [{
          property: 'start_time',
          nullHandling: null,
          direction: 'ASC',
        }],
      },
    }, {
      assetNos,
      kdtId,
      startTime,
      endTime,
    });
    ctx.json(0, 'ok', result);
  }

  async createStudentLessonV2(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      assetNo,
      studentId,
      lessonNo,
    } = ctx.request.body;

    const result = await new ConsumerAppointmentFacade(ctx).createStudentLessonV2(kdtId, {
      courseType: 1,
      assetNo,
      studentId,
      operatorId: ctx.userId,
      lessonNo,
      kdtId,
    });
    return ctx.json(0, 'ok', result);
  }

  async batchCancel(ctx) {
    const { kdtId = 0 } = ctx;
    const {
      studentLessonNos,
    } = ctx.request.body;

    const result = await new ConsumerAppointmentFacade(ctx).batchCancel(kdtId, {
      studentLessonNos,
      operator: this.formatOperator,
      kdtId,
    });
    return ctx.json(0, 'ok', result);
  }
};

module.exports = ApplyResultController;
