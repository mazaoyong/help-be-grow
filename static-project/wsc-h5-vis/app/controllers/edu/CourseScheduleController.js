const EduBaseController = require('./EduBaseController');
// const StudentLessonFacade = require('../../services/owl/edu/lesson/StudentLessonFacade');
const StudentLessonFacade = require('../../services/owl/client/edu/student/StudentLessonFacade');

class CourseScheduleController extends EduBaseController {
  async getCalendarData(ctx) {
    const kdtId = ctx.kdtId;
    const { buyerId: userId } = this.buyer;
    const {
      startTime,
      endTime,
      studentId = null,
    } = ctx.query;
    const res = await new StudentLessonFacade(ctx).findStudentValidRecordList(kdtId, {
      kdtId,
      userId,
      startTime,
      endTime,
      studentId: studentId || null,
    });

    ctx.json(0, 'ok', res);
  }

  async getLessonsByDate(ctx) {
    const { kdtId } = ctx;
    const { buyerId: userId } = this.buyer;
    const {
      startTime,
      endTime,
      studentId,
    } = ctx.query;

    const res = await new StudentLessonFacade(ctx).findStudentLessonByDate(kdtId, {
      kdtId,
      userId,
      startTime,
      endTime,
      studentId: studentId || null,
    });

    ctx.json(0, 'ok', res);
  }
}

module.exports = CourseScheduleController;
